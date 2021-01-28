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
                setTimeout(deleteVerMessage, 2500);
            } else if (message.content.startsWith(prefix + 'verify')) {
                var info = message.content.split(' ');
                var tag = info[1];
                console.log(tag);
                client.playerByTag(tag).then(response => {
                    let found = false;
                    console.log(userList);
                    for (i = 0; i < userList.length; i++) {
                        if (userList[i] == response.name) {
                            found = true;
                        }
                    }
                    if (!found) {
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
                    } else {
                        verificationChannel.lastMessage.delete();
                        verificationChannel.send('User is already on the server');
                        setTimeout(deleteVerMessage, 2500);
                    }
                }).catch(err => {
                    verificationChannel.lastMessage.delete();
                    verificationChannel.send("Invalid Player Tag");
                    setTimeout(deleteInvalidTagMessage, 2500);
                });
            }
        }
        else if (message.channel.name == 'bot-commands') {
            if (message.content == prefix + 'init') {
                botCommandsChannel = message.channel;
                guild = message.guild;
                leaderRole = guild.roles.cache.find(r => r.name === 'Leader');
                coleaderRole = guild.roles.cache.find(r => r.name === 'Co-Leader');
                elderRole = guild.roles.cache.find(r => r.name === 'Elder');
                memberRole = guild.roles.cache.find(r => r.name === 'Member');
                newMemberRole = guild.roles.cache.find(r => r.name === 'New Member');
                guild.members.cache.each(member => {
                    if (member.roles.cache.find(r => newMemberRole) != newMemberRole) {
                        userList.push(member.nickname);
                        console.log(member.nickname);
                    }
                });
                botCommandsChannel.lastMessage.delete();
                botCommandsChannel.send('bound to bot-commands channel');
                setTimeout(deleteBotMessage, 2500);
            } else if (message.content.startsWith(prefix + 'setClan')) {
                clanTag = message.content.substring(message.content.indexOf(' ') + 1);
                client.clanByTag(clanTag).then(response => {
                let members = response.memberList;
                for (i = 0; i < members.length; i++){
                    allMemberTags.push(members[i].tag);
                }
                botCommandsChannel.lastMessage.delete();
                }).catch(err => {
                    botCommandsChannel.lastMessage.delete();
                    botCommandsChannel.send('Invalid clan tag');
                    setTimeout(deleteBotMessage, 2500);
                });
            }
        }
    }
});

function deleteInvalidTagMessage() {
    verificationChannel.lastMessage.delete();
}

function deleteVerMessage() {
    verificationChannel.lastMessage.delete().catch(err => {});
}

function deleteBotMessage() {
    botCommandsChannel.lastMessage.delete().catch(err => {});
}