import axios from "axios";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

export default async function sendWhatsAppMessage(to, body) {
  try {
    await axios.post(
      "https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json",
      new URLSearchParams({
        To: to,
        Body: body
      }),
      {
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID,
          password: process.env.TWILIO_AUTH_TOKEN
        },
        httpsAgent: agent, // ⚠️ disables SSL validation
      }
    );
    console.log("✅ WhatsApp message sent");
  } catch (err) {
    console.error("❌ Failed to send WhatsApp message:", err.message);
  }
}
