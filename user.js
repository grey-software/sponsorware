const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  login: String,
  tier_name: String,
  creation_date: String,
  privacy: String,
});

//const Users = mongoose.model('Sponsors', userSchema);

module.exports = mongoose.model('User', userSchema);
