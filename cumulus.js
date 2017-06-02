var tmi = require('tmi.js')
var request = require('request')
var fs = require('pn/fs')
var url = require('url')
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until
var imgur = require('imgur')
var svg2png = require("svg2png");

var config = JSON.parse(fs.readFileSync('config.json'))
var CHANNEL = config.channel
var RUN_SILENTLY = (config.runSilently == 'true')

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
    username: config.username,
    password: config.password,
  },
  channels: [CHANNEL]
}
client = new tmi.client(options)
client.connect()

client.on('chat', (channel, user, message, self) => {
  if(self) return
  if((user.mod || user.username == 'greasyw00t') && message.toLowerCase() == "!cumulus start" && !isRunning) {
    isRunning = true
    words = {}
    if(!RUN_SILENTLY) client.say('#'+CHANNEL, "Cumulus Started")
  } else if((user.mod || user.username == 'greasyw00t') && message.toLowerCase() == "!cumulus stop" && isRunning) {
    if(!RUN_SILENTLY) client.say('#'+CHANNEL, 'Creating word cloud for this stream')
    isRunning = false
    createCloud(() => {
      uploadToImgur((cloud) => {
        if(!RUN_SILENTLY) client.say('#'+CHANNEL, 'Word cloud for this stream: ' +cloud)
        fs.unlinkSync('../../../../../Downloads/wordcloud.svg')
        fs.unlinkSync('dest.png')
      })
    })
  } else if(isRunning) {
    message = message.toUpperCase()
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

function createCloud(callback) {
  var keys = Object.keys(words)
  var cloud = ""
  keys.forEach((word) => {
    for(var i = 0; i < words[word]; i++) {
      cloud += word + " "
    }
    cloud += '\n'
  })

  var driver = new webdriver.Builder()
      .forBrowser('safari')
      .build();

  driver.get('https://www.jasondavies.com/wordcloud/');
  driver.sleep(1000)
  var inputField = driver.findElement(By.id('text'))
  //inputField.clear()
  //driver.findElement(By.id('text')).sendKeys(cloud);
  driver.executeScript("arguments[0].value = arguments[1]", inputField, cloud)
  driver.findElement(By.id('go')).click();
  driver.sleep(3000)
  driver.findElement(By.id('download-svg')).click();
  driver.sleep(3000)
  driver.quit()

  setTimeout(() => {
    fs.readFile('../../../../../Downloads/wordcloud.svg')
        .then(svg2png)
        .then(buffer => fs.writeFile("dest.png", buffer))
        .catch(e => console.error(e))

        setTimeout(callback, 6000)
  }, 13000)
}

function uploadToImgur(callback) {
  imgur.uploadFile('dest.png')
    .then(function (json) {
        callback(json.data.link)
    })
    .catch(function (err) {
        callback(err.message)
    })
}
