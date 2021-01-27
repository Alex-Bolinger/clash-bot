const auth = require("./auth.json");
const ClashApi = require('clash-of-clans-api');
let client = ClashApi({
    token: auth.CLASH_TOKEN
});

const Discord = require('discord.js');
let bot = new Discord.Client();

var verificationChannel;
var botCommandsChannel;

const prefix = '!';

bot.login(auth.DISCORD_TOKEN);

bot.on('ready', () => {
    console.log('bot has started');
});

bot.on('message', message => {
    if (message.content.startsWith(prefix)) {
        if (message.channel.name == 'verification-channel') {
            if (message.content == prefix + 'init') {
                verificationChannel = message.channel;
                verificationChannel.send('bound to verification-channel');
            }
        } else if (message.channel.name == 'bot-commands') {
            if (message.content == prefix + 'init') {
                botCommandsChannel = message.channel;
                botCommandsChannel.send('bound to bot-commands channel');
            }
        }
    }
});