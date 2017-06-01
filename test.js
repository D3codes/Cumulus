var imgur = require('imgur')




function uploadToImgur() {
  imgur.uploadFile('dest.png')
    .then(function (json) {
        console.log(json.data.link);
    })
    .catch(function (err) {
        console.error(err.message);
    });
}

const fs = require("pn/fs"); // https://www.npmjs.com/package/pn
const svg2png = require("svg2png");

fs.readFile('../../../../../Downloads/wordcloud.svg')
    .then(svg2png)
    .then(buffer => fs.writeFile("dest.png", buffer))
    .catch(e => console.error(e));

uploadToImgur()
