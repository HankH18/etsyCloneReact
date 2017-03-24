const mongoose = require('mongoose');

// ----------------------
// USERS
// ----------------------
const usersSchema = new mongoose.Schema({
  // required for authentication: DO NOT TOUCH Or You May Get Punched
  email:     { type: String, required: true },
  password:  { type: String, required: true },
  // x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x
  
   // example of optional fields
  name:      { type: String },
  createdAt: { type: Date, default: Date.now }

})

var listingSchema = new mongoose.Schema({

	item: {type: String, required: true},
	price: {type: String, required: true},
	description: {type: String, required: true},
	createdAt: {type: Date, default: Date.now()}
})

module.exports = {
  User: mongoose.model('User', usersSchema),
  Listing: mongoose.model('Listing', listingSchema)
}
