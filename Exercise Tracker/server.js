require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');

//middleware configurations
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))


//Models
const accountSchema = mongoose.Schema({
  username: { type: String },
});

const exerciseSchema = mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String },
  duration: { type: Number },
  date: { type: Date },
});

const Account = mongoose.model("account", accountSchema);
const Exercise = mongoose.model("exercise", exerciseSchema);

let countz = 0

//For debugging purposes in validating the project
function count(){
  countz+=1
  console.log(`Current freeCodeCamp check count: ${countz}/36`)
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//returns all users
app.get('/api/users', async (req, res) => {
  count()
  try {
    const dbData = await Account.find({})
    res.json(dbData)
  } catch (err) {
    console.log(err)
  }
})

//creates new user account
app.post('/api/users', async (req, res) => {
  count()
  try {
    const newUser = await new Account({username: req.body.username})
    await newUser.save()
    const { _id, username } = newUser
    res.json({ _id, username })
  } catch (err) {
    console.log(err)
  }
})

//adds exercise log
app.post('/api/users/:_id/exercises', async (req, res) => {
  count()
  const id = req.params._id
  const { description, duration } = req.body
  let { date } = req.body
  date = date ? new Date(date) : new Date()

  try {
    const foundUser = await Account.findById(id)
    if (!foundUser) {
      res.json({ message: "User does not exist!" })
    } else {
      const newExersice = new Exercise({
        id,
        description,
        duration,
        date
      })
      const exercise = await newExersice.save()

      res.json({
        _id: id,
        username: foundUser.username,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString()
      })
    }
  } catch (err) {
    res.json({ message: err })
  }

})

//gets exercise log with different available filters filters
app.get('/api/users/:_id/logs', async (req, res) => {
  count()
  const { from, to, limit } = req.query;
  const id  = req.params._id;
  const foundUser = await Account.findById(id);
  if (!foundUser) {
    res.json({ message: "User does not exist!" })
    return;
  }

  let dateCondition = {}
  let filter = {
    id
  }

  if (from || to) {
    if (from) {
    dateCondition["$gte"] = new Date(from)
    }
    if (to) {
      dateCondition["$lte"] = new Date(to)
    }
    filter.date = dateCondition;
  }

  const exercises = await Exercise.find(filter).limit(limit).exec()

  const log = exercises.map(item => ({
    description: item.description,
    duration: item.duration,
    date: item.date.toDateString()
  }))
  
  console.log({
    username: foundUser.username,
    count: exercises.length,
    id,
    log
  }) //for debugging purposes
  
  res.json({
    username: foundUser.username,
    count: exercises.length,
    id,
    log
  })
})



  mongoose.connect(process.env.MONGOURI)
  app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port 3000')
  })