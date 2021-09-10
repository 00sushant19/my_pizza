require('dotenv').config()
const express = require('express')
const Emitter = require('events')
const app = express();
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = process.env.PORT || 3000
// above line is telling that if "process.env.PORT" is present then use it else tkae 3000 
const session = require('express-session')
const flash = require('express-flash')

const MongoDbStore = require('connect-mongo')

const passport = require('passport')

app.use(express.urlencoded({extended: false}))
app.use(express.json())
// database connection 
const mongoose = require('mongoose')
const url = 'mongodb://localhost/my_pizza'
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
  // we're connected!
  console.log('database connected....');
});

// event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)
// session config 
app.use(session({
  secret: process.env.COOCKIE_SECRET,
  resave: false,
  store: MongoDbStore.create({
    mongoUrl : url
  }),
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24}  //24 hours
  // cookie: {maxAge: 1000 * 10}  //10 sec for testing

}))

// passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
// assets
app.use(express.static('public'))

// global middleware
app.use((req, res, next) => {
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})


app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
// setting the path 
app.set('view engine', 'ejs')
// setting the template ejs

require('./routes/web')(app)


const server = app.listen(3000, () => {
    console.log(`listening on port ${PORT}`)
})

// socket

const io = require('socket.io')(server)

io.on('connection', (socket) =>{
  // join
  // console.log(socket.id)
  socket.on('join',(orderId) =>{
    // console.log(orderId)
    socket.join(orderId)
  })
})

eventEmitter.on('orderUpdated', (data)=>{
  io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(data) => {
  io.to('adminRoom').emit('orderPlaced',data)
})