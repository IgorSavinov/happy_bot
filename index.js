const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = '6367774417:AAFKh_UUgrKVSYhHs9-Tlwl7OShtek-TUaU';

const bot = new TelegramBot(token, { polling: true });

const bannedWords = ['крипта', 'курсы', 'набираю'];

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageText = msg.text.toLowerCase();

  // Логирование сообщения пользователя
  logMessage(msg);

  const containsBannedWord = bannedWords.some((word) => messageText.includes(word.toLowerCase()));

  if (containsBannedWord) {
    bot.restrictChatMember(chatId, userId, { until_date: Date.now() / 1000 + 60 }); // Restrict user for 60 seconds
    bot.sendMessage(chatId, `User ${msg.from.username} has been restricted for using banned words.`);
  }
});

// Функция для логирования сообщений в файл
function logMessage(msg) {
  const logData = `${new Date().toLocaleString()} - From: ${msg.from.username} (${msg.from.id}), Message: ${msg.text}\n`;
  fs.appendFile('messageLog.txt', logData, (err) => {
    if (err) {
      console.error('Ошибка при записи в файл лога:', err);
    }
  });
}
