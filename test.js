var $ = require('jquerygo')

$.visit('https://www.jasondavies.com/wordcloud/', function() {
  $('#text').val('test', function() {
    $('#text').text('TEST', function() {
      $('#go').click(function() {
        $('#download-svg').click(function() {
          $.close()
        })
      })
    })
  })
})
