// utils/telegram.js
import axios from "axios";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const sendTelegramMessage = async (message) => {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML",
    });
    console.log("✅ Telegram message sent");
  } catch (err) {
    console.error("❌ Failed to send Telegram message:", err.message);
  }
};

export default sendTelegramMessage;
