const { faker } = require('@faker-js/faker');

function getRandomItem(items) {
    return items[Math.floor(Math.random()*items.length)]
}

function changeAllNicks(members, delay, nicks) {
    for (let member of members) {
        setTimeout(() => {
            member[1].setNickname(getRandomItem(nicks)).catch(error => {})
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

module.exports.getRandomItem = getRandomItem
module.exports.changeAllNicks = changeAllNicks
module.exports.spamALlChannels = spamALlChannels