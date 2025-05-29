import findHTML from "./findHTML.js";
import decodeString from "./decodeString.js";
import findSender from "./findSender.js";

async function processMessage(gmail, messageId) {
  const actualEmail = await gmail.users.messages.get({ userId: "me", id: messageId });

  const payload = actualEmail.data.payload;
  const decodedString = findHTML(payload);

  if (!decodedString) {
    return
  }
  const unsubLink = decodeString(decodedString); 
  const sender = unsubLink ? findSender(payload.headers) : null;
  console.log(sender)

  return unsubLink ? { unsubLink, sender } : null;
}

export default processMessage