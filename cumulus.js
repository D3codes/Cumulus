var tmi = require('tmi.js')
var request = require('request')
var fs = require('fs')
var cheerio = require('cheerio')
var url = require('url')

var words = {}
var isRunning = false
var options = {
  options: {
    debug: true
  },
  connection: {
    reconnect: true
  },
  identity: {
    username: 'iota_bot',
    password: JSON.parse(fs.readFileSync('config.json')).password,
  },
  channels: ['amoney_tv']
}
client = new tmi.client(options)
client.connect()

client.on('chat', (channel, user, message, self) => {
  if(self) return
  if(user.mod && message.toLowerCase() == "!cumulus start" && !isRunning) {
    isRunning = true
    client.say("Cumulus Started")
  } else if(user.mod && message.toLowerCase() == "!cumulus stop" && isRunning) {
    isRunning = false
    createCloud()
  }

  if(isRunning) {
    message = message.toLowerCase()
                    .replace(/[.,\/#!$%\^&\*;?+@:{}=\-_`~()]/g,"")
                    .replace(/\s{2,}/g," ")
    var message_parts = message.split(' ')
    message_parts.forEach((word) => {
      if(words[word]) {
        words[word]++
      } else {
        words[word] = 1
      }
    })
  }
})

function createCloud() {
  var keys = Object.keys(words)
  var cloud = ""
  keys.forEach((word) => {
    for(var i = 0; i < words[word]; i++) {
      cloud += word + " "
    }
    cloud += '\n'
  })

  url = 'http://www.wordclouds.com/'
  request(url, (error, response, html) => {
    var $ = cheerio.load(html)

    $('.btn btn-default dropdown-toggle').click()
  })
}
