const express = require('express')

const app = express();
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = process.env.PORT || 3000
// above line is telling that if "process.env.PORT" is present then use it else tkae 3000 

app.get('/', (req,res)=>{
    res.render('home');
})

// assets
app.use(express.static('public'))

app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
// setting the path 
app.set('view engine', 'ejs')
// setting the template ejs
app.listen(3000, () => {
    console.log(`listening on port ${PORT}`)
})