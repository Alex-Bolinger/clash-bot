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
var botsRole;

var userList = [];
var allMemberTags = [];

const prefix = '!';

bot.login(auth.DISCORD_TOKEN);

bot.on('ready', () => {
    console.log(getTime() + ' bot has started');
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
                console.log(getTime() + ' verfiy ' + tag);
                client.playerByTag(tag).then(response => {
                    let found = false;
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
                        } else if (response.role == 'admin') {
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
                botRole = guild.roles.cache.find(r => r.name === 'Bots');
                guild.members.cache.each(member => {
                    if (member.roles.cache.find(r => newMemberRole) != newMemberRole) {
                        userList.push(member.nickname);
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
                botCommandsChannel.send('Bound to clan successfully');
                setTimeout(deleteBotMessage, 2500);
                setInterval(updateMemberRoles, 15000);
                }).catch(err => {
                    botCommandsChannel.lastMessage.delete();
                    botCommandsChannel.send('Invalid clan tag');
                    setTimeout(deleteBotMessage, 2500);
                });
            }
        }
    }
});

function updateMemberRoles() {
    client.clanByTag(clanTag).then(response => {
        let clanMembers = response.memberList;
        let guildMembers = guild.members.cache;
        guildMembers.each(member => {
            if (member.roles.cache.array().length == 1) {
                member.roles.add(newMemberRole);
            }
            if (member.roles.cache.find(r => r.name === newMemberRole.name) != newMemberRole ^ member.roles.cache.find(r => r.name === botRole.name) != botsRole) {
                console.log(getTime() + ' ' + member.nickname);
                if (member.roles.cache.find(r => leaderRole.name === leaderRole.name) === leaderRole) {
                    for (i = 0; i < clanMembers.length; i++) {
                        if (clanMembers[i].name == member.nickname) {
                            if (clanMembers[i].role != 'leader') {
                                console.log(getTime() + ' leader ' + member.nickname + ' ' + member.roles.cache.array()[0].name + ' ' + clanMembers[i].role);
                                member.roles.remove(leaderRole);
                                if (clanMembers[i].role == 'coLeader') {
                                    member.roles.add(coleaderRole);
                                } else if (clanMembers[i].role == 'admin') {
                                    member.roles.add(elderRole);
                                } else {
                                    member.roles.add(memberRole);
                                }
                            }
                        }
                    }
                } else if (member.roles.cache.find(r => coleaderRole.name === coleaderRole.name) === coleaderRole) {
                    for (i = 0; i < clanMembers.length; i++) {
                        if (clanMembers[i].name == member.nickname) {
                            if (clanMembers[i].role != 'coLeader') {
                                console.log(getTime() + ' coleader ' + member.nickname + ' ' + member.roles.cache.array()[0].name + ' ' + clanMembers[i].role);
                                member.roles.remove(coleaderRole);
                                if (clanMembers[i].role == 'leader') {
                                    member.roles.add(leaderRole);
                                } else if (clanMembers[i].role == 'admin') {
                                    member.roles.add(elderRole);
                                } else {
                                    member.roles.add(memberRole);
                                }
                            }
                        }
                    }
                } else if (member.roles.cache.find(r => elderRole.name === elderRole.name) === elderRole) {
                    for (i = 0; i < clanMembers.length; i++) {
                        if (clanMembers[i].name == member.nickname) {
                            if (clanMembers[i].role != 'admin') {
                                console.log(getTime() + ' elder ' + member.nickname + ' ' + member.roles.cache.array()[0].name + ' ' + clanMembers[i].role);
                                member.roles.remove(elderRole);
                                if (clanMembers[i].role == 'coLeader') {
                                    member.roles.add(coleaderRole);
                                } else if (clanMembers[i].role == 'leader') {
                                    member.roles.add(leaderRole);
                                } else {
                                    member.roles.add(memberRole);
                                }
                            }
                        }
                    }
                } else {
                    for (i = 0; i < clanMembers.length; i++) {
                        if (clanMembers[i].name == member.nickname) {
                            if (clanMembers[i].role != 'member') {
                                console.log(getTime() + ' member ' + member.nickname + ' ' + member.roles.cache.array()[0].name + ' ' + clanMembers[i].role);
                                member.roles.remove(memberRole);
                                if (clanMembers[i].role == 'coLeader') {
                                    member.roles.add(coleaderRole);
                                } else if (clanMembers[i].role == 'admin') {
                                    member.roles.add(elderRole);
                                } else {
                                    member.roles.add(leaderRole);
                                }
                            }
                        }
                    }
                }
            }
        });
    }).catch(err => {
        console.log(getTime + ' ' + err);
    });
}

function getTime() {
    let d = new Date();
    return d.getMonth() + '/' + d.getDay() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}

function deleteInvalidTagMessage() {
    verificationChannel.lastMessage.delete();
}

function deleteVerMessage() {
    verificationChannel.lastMessage.delete().catch(err => {});
}

function deleteBotMessage() {
    botCommandsChannel.lastMessage.delete().catch(err => {});
}