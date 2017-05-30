var tmi = require('tmi.js')
var request = require('request')
var fs = require('fs')
var express = require('express')
var cheerio = require('cheerio')
var cumulus = express()

cumulus.get('/start', (req, res) => {
  console.log(req.url)
})

cumulus.get('/stop', (req, res) => {
  console.log(req.url)
})

cumulus.listen('8081')
