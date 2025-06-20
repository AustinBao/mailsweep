import db from '../config/db.js';

export async function savePageToken(userId, token) {
  try {
    await db.query(
      `UPDATE users SET page_token = $1 WHERE id = $2`,
      [token, userId]
    );
  } catch (err) {
    console.error("Cant save page token: ", err);
  }
}

export async function getPageToken(userId) {
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


export async function getLastScanTimestamp(userId) {
  try {
    const result = await db.query(`SELECT last_scan_timestamp FROM users WHERE id = $1`, [userId]);
    const timestamp =  result.rows[0]?.last_scan_timestamp || null
    return timestamp;
  } catch (err) {
    console.error("Error fetching last scan timestamp:", err);
    return null;
  }
}

export async function saveLastScanTimestamp(userId, timestamp) {
  try {
    await db.query(`UPDATE users SET last_scan_timestamp = $1 WHERE id = $2`, [timestamp, userId]);
  } catch (err) {
    console.error("Error saving last scan timestamp:", err);
  }
}

export function getRootDomain(domain) {
  const parts = domain.split('.');
  return parts.slice(-2).join('.'); 
}

export function getFaviconURL(rawEmail) {
  // Remove angle brackets if they exist
  const email = rawEmail.replace(/[<>]/g, "").trim();
  const rawDomain = email.split('@')[1];
  const domain = getRootDomain(rawDomain)
  return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
}