const mongoose = require('mongoose')
// in java script if first letter of variable is capital 
// then it means that  it contains either class or constructor

const Schema = mongoose.Schema

const menuSchema = new Schema({
    name: { type:String, required: true },
    image: { type:String, required: true },
    price: { type:Number, required: true },
    size: { type:String, required: true }
})


module.exports = mongoose.model('Menu', menuSchema)
