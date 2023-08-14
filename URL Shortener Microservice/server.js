require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const https = require('https')

var counter = 0;
var links = []

const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({extended: false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post('/api/shorturl', async(req ,res)=>{
  const url = req.body.url
  try {
    await https.get(url, (response)=>{
      if(response.statusCode == 200 ){
        links.push({url, idx: counter})
        counter+=1
        res.json({ original_url : url, short_url : counter - 1})
      }
    })
  } catch (error) {
    console.log(error)
    res.json({"error":"invalid url"})
  }
})

app.get('/api/shorturl/:idx', (req, res)=>{
  const index = req.params.idx
  const url = links[index].url
  res.redirect(url)
})

  

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});