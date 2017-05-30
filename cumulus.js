var tmi = require('tmi.js')
var request = require('request')
var fs = require('fs')
var cheerio = require('cheerio')
var express = require('express')
var cumulus = express()
var url = require('url')

var clients = {}
var channels = {}

cumulus.get('/start', (req, res) => {
  var url_parts = url.parse(req.url, true)
  var channel = url_parts.query[""]
  if(!clients[channel]) {
    createClient(channel)
  }
  res.end("Cumulus active")
})

cumulus.get('/stop', (req, res) => {
  var url_parts = url.parse(req.url, true)
  var channel = url_parts.query[""]
  if(clients[channel]) {
    delete clients[channel]
    var words = channels[channel].join(' ')
    res.end(words)
  } else {
      res.end("Cumulus not running for " + channel)
  }
})

cumulus.listen('4000')

function createClient(channel) {
  channels[channel] = {}
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
    channels: [channel]
  }
  clients[channel] = new tmi.client(options)
  clients[channel].connect()

  clients[channel].on('chat', (chan, userstate, message, self) => {
    if(self) return
    var message_parts = message.split(' ')
    message_parts.forEach((word) => {
      if(channels[channel][word]) {
        channels[channel][word]++
      } else {
        channels[channel][word] = 1
      }
    })
  })
}
