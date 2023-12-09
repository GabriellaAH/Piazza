const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const User = new Schema({
  userName: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true    
  },
  password: {    
      type: String,
      require: true
  },
  fullName: {    
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', User)