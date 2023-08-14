var express = require('express');
var cors = require('cors');
require('dotenv').config()


var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.urlencoded({extended: true}))

let name, type

const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, './files')
  },
  filename: (req, file, cb)=>{
    cb(null, Date.now() + path.extname(file.originalname))
    console.log(file)
    name = file.originalname
    type = file.mimetype
    
  }
})

const upload = multer({storage: storage})


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res)=>{
  res.json({name, type, size: req.file.size})
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});