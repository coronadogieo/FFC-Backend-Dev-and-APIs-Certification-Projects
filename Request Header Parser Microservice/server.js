require('dotenv').config();
var express = require('express');
var app = express();


var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));


app.use(express.static('public'));
app.get('/', function (req, res) {
  console.log(req.header)
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

//returns the client machine's information
app.get('/api/whoami', (req, res)=>{
  const software = req.headers['user-agent']
  const language = req.headers['accept-language']
  const ipaddress = req.connection.remoteAddress
  res.json({ipaddress, language, software})
})


var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
