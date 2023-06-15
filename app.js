const express = require('express');
const path = require('path');


const app = express();
const port = 3000;

app.use('/audio', express.static('audio'));
app.use('/card', express.static('card'));
app.use('/character', express.static('character'));
app.use('/extension', express.static('extension'));
app.use('/files', express.static('files'));
app.use('/font', express.static('font'));
app.use('/game', express.static('game'));
app.use('/image', express.static('image'));
app.use('/layout', express.static('layout'));
app.use('/mode', express.static('mode'));
app.use('/theme', express.static('theme'));
app.get('/', function(request, response){
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => {
  console.log(`No-name app listening on port ${port}`)
})