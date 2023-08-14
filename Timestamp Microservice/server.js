
var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));
app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.get("/api/:date?", (req,res) => {
  const inputDate = req.params.date
  const validDate = Date.parse(inputDate)
  const isUnix = /^[0-9]+$/.test(inputDate)

  let unix=0, utc=''

  //User requests w/ a valid date parameter
  if(validDate){
    unix = new Date(inputDate)
    utc = unix.toUTCString()
    
    console.log(`[CONDITION 1] Input: ${inputDate}, Output: unix=${unix.valueOf()} -- ${utc}`) //For debugging purposes :)
    return res.json({unix: unix.valueOf(), utc})

  //User requests w/ an empty date parameter
  } else if(inputDate==0||inputDate==null){
    unix = new Date()
    utc = unix.toUTCString()
    
    console.log(`[CONDITION 2] Input: ${inputDate}, Output: unix=${unix.valueOf()} -- ${utc}`) //For debugging purposes :)
    return res.json({unix: unix.valueOf(), utc})

  //User requests w/ a valid UNIX date parameter
  } else if(isUnix && isNaN(validDate)){
    unix = new Date(parseInt(inputDate))
    utc = unix.toUTCString()
    
    console.log(`[CONDITION 3] Input: ${inputDate}, Output: unix=${unix.valueOf()} -- ${utc}`) //For debugging purposes :)
    return res.json({unix: unix.valueOf(), utc})

  //User requests w/ a valid UNIX date parameter
  } else {
    console.log(`[CONDITION 4] Input: ${inputDate}, Output: INVALID`) //For debugging purposes :)
    res.json({error: "Invalid Date"});
  }
})

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
