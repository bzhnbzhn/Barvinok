const TelegramAPI = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');

const token = '6023098116:AAFCuKcoBri1ZPCl4SsjgsAKUXIeJTej7k4';

const bot = new TelegramAPI(token, {polling: true});

const chats = {};


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Відгадай цифру')
    chats[chatId] = Math.floor(Math.random() * 10);
    await bot.sendMessage(chatId, 'Відгадуй число', gameOptions)
}

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'The first command'},
        {command: 'info', description: 'The info command'},
        {command: 'game', description: 'The game command'},
    ])

    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const userName = msg.from.first_name;

        if (text === '/start') {
            return bot.sendMessage(chatId, `${userName}, a ти котик чи собачка?`)
        }
        if (text === 'собачка') {
            await bot.sendAnimation(chatId, `https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/31.webp`);
            return bot.sendMessage(chatId, `аф-аф ?`)
        }
        if (text === 'котик') {
            await bot.sendAnimation(chatId, `https://tlgrm.ru/_/stickers/06c/d14/06cd1435-9376-40d1-b196-097f5c30515c/12.webp`);
            return bot.sendMessage(chatId, `мяю-мяю ?`)
        }
        if (text === 'game') {
            return startGame(chatId);

        }
        return bot.sendMessage(chatId, `Я тебя не розумію`);

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Вітаю`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ні ${chats[chatId]}`, againOptions)
        }
    })
}

start();