import { Worker } from 'worker_threads'
import bots from './raidData/TOKENS.json' assert {type: "json"};

import fs from 'fs'

const layoutPath = './bots/main.js'
let layout

console.log('Preparing bot layouts...')

try {
    layout = fs.readFileSync(layoutPath, 'utf8')
}
catch (e) {
    console.warn(e)
}

let counter = 0
for (let nickname of Object.keys(bots)) {
    const token = bots[nickname]
    const fileName = nickname + '.js'

    let content = layout

    content += `const delay = ${counter}\n`
    content += `const token = '${token}'\n`
    content += 'commandHanlder = launch(token, delay)'

    fs.writeFile(`./bots/${fileName}`, content, (err) => {
        if (err) {
            console.warn(err)
        }
    })

    counter += 100
}

console.log('Bot layouts successfully prepared [+]')

console.log('Launching...')

for (let nickname of Object.keys(bots)) {
    if (nickname === 'main') {
        continue
    }

    const botPath = `./bots/${nickname}.js`

    new Worker(botPath)
}