const auth = require("./auth.json");
const ClashApi = require('clash-of-clans-api');
let client = ClashApi({
    token: auth.CLASH_TOKEN
});

const Discord = require('discord.js');
let bot = new Discord.Client();

var verificationChannel;
var botCommandsChannel;

var guild;
var clanTag;

var leaderRole;
var coleaderRole;
var elderRole;
var memberRole;
var newMemberRole;

var userList = [];
var allMemberTags = [];

const prefix = '!';

bot.login(auth.DISCORD_TOKEN);

bot.on('ready', () => {
    console.log('bot has started');
});

bot.on('message', async message => {
    if (message.content.startsWith(prefix)) {
        if (message.channel.name == 'verification-channel') {
            if (message.content == prefix + 'init') {
                verificationChannel = message.channel;
                verificationChannel.lastMessage.delete();
                verificationChannel.send('bound to verification-channel');
                setTimeout(deleteVerInitMessage, 5000);
            } else if (message.content.startsWith(prefix + 'verify')) {
                var info = message.content.split(' ');
                var tag = info[1];
                console.log(tag);
                client.playerByTag(tag).then(response => {
                    console.log(response);
                    message.member.setNickname(response.name);
                    if (response.role == 'leader') {
                        message.member.roles.add(leaderRole);
                        message.member.roles.remove(newMemberRole);
                    } else if (response.role == 'coLeader') {
                        message.member.roles.add(coleaderRole);
                        message.member.roles.remove(newMemberRole);
                    } else if (response.role == 'elder') {
                        message.member.roles.add(elderRole);
                        message.member.roles.remove(newMemberRole);
                    } else {
                        message.member.roles.add(memberRole);
                        message.member.roles.remove(newMemberRole);
                    }
                    verificationChannel.lastMessage.delete();
                }).catch(err => {
                    verificationChannel.send("Invalid Player Tag");
                    verificationChannel.lastMessage.delete();
                    setTimeout(deleteInvalidTagMessage, 5000);
                });
            }
        } else if (message.channel.name == 'bot-commands') {
            if (message.content == prefix + 'init') {
                botCommandsChannel = message.channel;
                guild = message.guild;
                leaderRole = guild.roles.cache.find(r => r.name === 'Leader');
                coleaderRole = guild.roles.cache.find(r => r.name === 'Co-Leader');
                elderRole = guild.roles.cache.find(r => r.name === 'Elder');
                memberRole = guild.roles.cache.find(r => r.name === 'Member');
                newMemberRole = guild.roles.cache.find(r => r.name === 'New Member');
                botCommandsChannel.lastMessage.delete();
                botCommandsChannel.send('bound to bot-commands channel');
                setTimeout(deleteBotInitMessage, 5000);
            } else if (message.content.startsWith(prefix + 'setClan')) {
                clanTag = message.content.substring(message.content.indexOf(' ') + 1);
                client.clanByTag(clanTag).then(response => {
                    var members = response.memberList;
                    for (i = 0; i < members.length; i++){
                        allMemberTags.push(members[i].tag);
                        userList.push(members[i].name);
                        console.log(members[i].name);
                    } 
                    botCommandsChannel.lastMessage.delete();
                }).catch(err => {

                });
            }
        }
    }
});

function deleteInvalidTagMessage() {
    verificationChannel.lastMessage.delete();
}

function deleteVerInitMessage() {
    verificationChannel.lastMessage.delete().catch(err => {});
}

function deleteBotInitMessage() {
    botCommandsChannel.lastMessage.delete().catch(err => {});
}