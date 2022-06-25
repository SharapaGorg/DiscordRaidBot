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
              console.warn(`Undefined option: ${firstWord}, type help for more info`)
              return
          }

          command[firstWord](option)
      })
      .catch((err) => {
          console.warn(err)
      })
}, DELAY)