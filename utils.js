import { faker} from '@faker-js/faker'
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';

function getRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)]
}

function changeAllNicks(members, delay, nicks) {
    for (let member of members) {
        setTimeout(() => {
            member[1].setNickname(getRandomItem(nicks)).catch(error => { })
        }, delay)
    }
}

function spamALlChannels(channels, delay) {
    for (let channel of channels) {
        if (channel[1].type === 'GUILD_TEXT') {
            setTimeout(() => {
                const randomMessage = faker.lorem.sentence(10)

                channel[1].send(randomMessage)
            }, delay)
        }
    }
}

function exitVoiceChannel(guildId) {
    let currentConnection = getVoiceConnection(guildId)

    try {
        currentConnection.destroy()
    }
    catch (e) { }
}

export default {getRandomItem, changeAllNicks, spamALlChannels, exitVoiceChannel}