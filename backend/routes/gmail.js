import express from 'express';
import { google } from 'googleapis';
import db from '../config/db.js';
import processMessage from '../utils/processMessage.js';


const router = express.Router();


async function savePageToken(userId, token) {
  try {
    await db.query(
      `UPDATE users SET page_token = $1 WHERE id = $2`,
      [token, userId]
    );
    
  } catch (err) {
    console.error("Cant save page token: ", err);
  }
}


async function getPageToken(userId) {
  try {
    const result = await db.query(
      `SELECT page_token FROM users WHERE id = $1`,
      [userId]
    );
    return result.rows[0].page_token;

  } catch (err) {
    console.error("Cant get page token: ", err);
    return null;
  }
}


router.get("/userinfo", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Not Authenticated")
  }
  const accessToken = req.user.accessToken
  const userId = req.user.id

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })
  const gmail = google.gmail({ version: "v1", auth: oauth2Client})

  try {
    const result = await gmail.users.getProfile({userId: 'me'})
    // const messagesTotal = result.data.messagesTotal
    const threadsTotal = result.data.threadsTotal
    res.status(200).json(threadsTotal);

  } catch (err) {
    console.log(err)
    res.status(500).send("Failed to fetch Gmail data");
  }
})


router.post('/unsub', async (req, res) => { 
  const email_id = req.body.email_id;
  await db.query(`UPDATE subscriptions SET is_unsubscribed = $1 WHERE id = $2`, 
    [true, email_id]
  );
  res.status(200).json("Successfully updated is_unsubscribed")
});


router.post('/delete', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Not authenticated");
  }
  const subscription_id = req.body.subscription_id;

  // mark subscription as deleted in db to change card's bg color
  await db.query("UPDATE subscriptions SET is_deleted = true WHERE id = $1", [subscription_id]);

  // grab email ids to delete
  const allMailToDelete = await db.query(`SELECT * FROM mail_to_delete WHERE subscription_id = $1`, [subscription_id]);
  const originalMailToDelete = await db.query(`SELECT email_id FROM subscriptions WHERE id = $1`, [subscription_id]);

  // turn into an array to feed into batchDelete
  let emailIds = allMailToDelete.rows.map(item => item.email_id);
  emailIds.push(originalMailToDelete.rows[0].email_id)
  if (!emailIds.length) {
    return res.status(404).json({ message: 'No emails to delete.' });
  }
  // setup google api
  const oauth2Client = new google.auth.OAuth2( process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:3001/auth/google/callback" );
  oauth2Client.setCredentials({ access_token: req.user.accessToken, refresh_token: req.user.refreshToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  
  try { 
    const deleteResult = await gmail.users.messages.batchDelete({userId: "me", requestBody: {"ids": emailIds}})

    // Delete removed emails from mail_to_delete table so email counter is accurate
    await db.query(`DELETE FROM mail_to_delete WHERE subscription_id = $1`, [subscription_id]);

    res.status(200).json(deleteResult)
  } catch (err){
    console.log("Couldnt delete mail: " + err)
  }
});

async function saveSubscriptionsToDB (userId, sender, sender_address, unsubLink, email_id, domain_pic) {
  const result = await db.query(`INSERT INTO subscriptions 
    (user_id, email_id, sender, sender_address, subject, unsubscribe_link, is_unsubscribed, is_deleted, unsubscribed_at, domain_pic) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    ON CONFLICT (user_id, sender_address) DO NOTHING RETURNING id`, // will stop the error from being triggered if (user_id, sender_address) pair already exists.
    [userId, email_id, sender, sender_address, null, unsubLink, false, false, null, domain_pic]
  );

  if (result.rows.length === 0) {
    const subResult = await db.query(`
      SELECT id FROM subscriptions WHERE user_id = $1 AND sender_address = $2
    `, [userId, sender_address]);

    const subscriptionId = subResult.rows[0]?.id;
    if (subscriptionId) {
      await db.query(`
        INSERT INTO mail_to_delete (subscription_id, email_id)
        VALUES ($1, $2) ON CONFLICT (email_id) DO NOTHING
      `, [subscriptionId, email_id]);
    }
  }
}


function getRootDomain(domain) {
  const parts = domain.split('.');
  return parts.slice(-2).join('.'); 
}


function getFaviconURL(rawEmail) {
  // Remove angle brackets if they exist
  const email = rawEmail.replace(/[<>]/g, "").trim();
  const rawDomain = email.split('@')[1];
  const domain = getRootDomain(rawDomain)
  return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
}


router.get("/", async (req, res) => {
  // req.isAuthenticated() is from Passport. Passport adds this new method to the req object.
  if (!req.isAuthenticated()) { 
    return res.status(401).send("Not authenticated");
  }
  const accessToken = req.user.accessToken;
  const userId = req.user.id;

  const oauth2Client = new google.auth.OAuth2();  //  creates a Google auth client.
  oauth2Client.setCredentials({ access_token: accessToken }); // add user's access token after logging in to Google.
  const gmail = google.gmail({ version: "v1", auth: oauth2Client }); // Now this client is authorized to access the user’s Gmail.
  // You’re telling Google: "I want to use Gmail API version 1." auth is your authorized client. Now you can call Gmail API methods.

  try {
    const currentPageToken = await getPageToken(userId);

    const result = await gmail.users.messages.list({
      userId: "me",  // userId: "me" means “use the currently authenticated user.”
      labelIds: ['INBOX'], // look only in inbox
      maxResults: 5,
      pageToken: currentPageToken,
    })

    if (!result.data.messages || result.data.messages.length === 0) {  // when we reach the end of the inbox
      await savePageToken(userId, null);  // clear page_token in db if no more emails
      return res.status(200).json({ done: true, messages: [] });
    }

    const nextToken  = result.data.nextPageToken
    if (nextToken ) {
      await savePageToken(userId, nextToken ); // save the new page token to page_token
    }

    let unsubLinks = []
    let senders = []
    let sender_addresses = []
    let email_ids = []
    let domain_pics = []

    for (let message of result.data.messages) {
      const data = await processMessage(gmail, message.id)
      if (data) {
        let rawSender = data.sender;
        let sender = "";
        let sender_address = "";

        if (rawSender.includes("<")) {
          let indexOfSenderAddress = rawSender.indexOf("<");
          sender = rawSender.slice(0, indexOfSenderAddress).trim().replace(/^"+|"+$/g, '');  // removes surrounding quotes
          sender_address = rawSender.slice(indexOfSenderAddress)
        } else {
          sender = ""; // or rawSender if you want to treat this as the sender name
          sender_address = rawSender.trim();
        }
        
        unsubLinks.push(data.unsubLink)
        senders.push(sender)
        sender_addresses.push(sender_address)
        email_ids.push(message.id)
        domain_pics.push(getFaviconURL(sender_address))
      } 
    }

    // console.log(unsubLinks, senders, email_ids)
    for (let i = 0; i < senders.length; i++) {
      saveSubscriptionsToDB(userId, senders[i], sender_addresses[i], unsubLinks[i], email_ids[i], domain_pics[i]);
    }

    // res.json(result.data);
    res.status(200).json({ done: !nextToken, messages: result.data.messages });

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch Gmail data");
  }
}); 


export default router;
