const TelegramBot = require('node-telegram-bot-api');

// Diqqat: Bu yerga BotFather dan olingan haqiqiy tokenni kiritishingiz kerak.
// Agar tokengiz bo'lmasa, Telegramda @BotFather ga kirib yangi bot oching.
const token = 'SIZNING_BOT_TOKENINGIZNI_SHU_YERGA_YOZING';

// Botni polling orqali ishga tushirish
const bot = new TelegramBot(token, { polling: true });

// React Vebsaytingiz manzili (Vercel, Netlify yoki Ngrok manzili)
// Localhost:5175 Telegramda ishlamaydi, uni doimiy linkka qo'yish kerak bo'ladi.
const WEB_APP_URL = 'https://sizning-saytingiz-manzili.com';

// /start buyrug'i berilganda
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;

  // Mini App tugmasi bilan xabar yuborish
  bot.sendMessage(chatId, `Assalomu alaykum, ${firstName}! \n\nTaklifchi platformasiga xush kelibsiz. Quyidagi tugma orqali ilovaga kiring:`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🌟 Ilovani ochish",
            web_app: { url: WEB_APP_URL }
          }
        ]
      ]
    }
  });
});

console.log('🤖 Telegram Bot ishga tushdi...');
