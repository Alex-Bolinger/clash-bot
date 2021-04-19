const auth = require("./authenticator/auth.json");
const ClashApi = require('clash-of-clans-api');
const fs = require('fs');
const info = require('./guildInfo.json');
let client = ClashApi({
    token: auth.CLASH_TOKEN
});

const Discord = require('discord.js');
let bot = new Discord.Client();

bot.login(auth.DISCORD_TOKEN);

bot.on('ready', () => {
    console.log(getTime() + ' bot has started');
    
});

bot.on('message', async message => {

});

function pingForWar() {
    
}

function updateMemberRoles() {
    //TODO --> Put this entire block inside of a loop that goes through each 

    client.clanByTag(clanTag).then(response => {
        let clanMembers = response.memberList;
        let guildMembers = guild.members.cache;
        guildMembers.each(member => {
            if (member.roles.cache.array().length == 1) {
                member.roles.add(newMemberRole);
            }
            if (member.roles.cache.find(r => r.name === newMemberRole.name) != newMemberRole ^ member.roles.cache.find(r => r.name === botsRole.name) == botsRole) {
                if (member.roles.cache.find(r => r.name === leaderRole.name) === leaderRole) {
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
                } else if (member.roles.cache.find(r => r.name === coleaderRole.name) === coleaderRole) {
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
                } else if (member.roles.cache.find(r => r.name === elderRole.name) === elderRole) {
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
                } else if (member.roles.cache.find(r => r.name === memberRole.name) === memberRole) {
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
    return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
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