require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  userName:     { type: String, unique: true },
  password:     String,
  email:        String,
  loginHistory: [{
    dateTime:  Date,
    userAgent: String
  }]
});

let User;

module.exports.initialize = function() {
  return new Promise((resolve, reject) => {
    const db = mongoose.createConnection(process.env.MONGODB);
    db.on('error', err => reject(err));
    db.once('open', () => {
      User = db.model('users', userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function(userData) {
  return new Promise((resolve, reject) => {
    if (userData.password !== userData.password2) {
      return reject('Passwords do not match');
    }
    bcrypt.hash(userData.password, 10)
      .then(hash => {
        const newUser = new User({
          userName:     userData.userName,
          password:     hash,
          email:        userData.email,
          loginHistory: []
        });
        return newUser.save();
      })
      .then(() => resolve())
      .catch(err => {
        if (err.code === 11000)      reject('User Name already taken');
        else if (err.message.match(/bcrypt/i)) reject('There was an error encrypting the password');
        else                         reject(`There was an error creating the user: ${err}`);
      });
  });
};

module.exports.checkUser = function(userData) {
  return new Promise((resolve, reject) => {
    User.find({ userName: userData.userName })
      .then(users => {
        if (!users.length) {
          return reject(`Unable to find user: ${userData.userName}`);
        }
        const u = users[0];
        bcrypt.compare(userData.password, u.password)
          .then(isMatch => {
            if (!isMatch) {
              return reject(`Incorrect Password for user: ${userData.userName}`);
            }
            if (u.loginHistory.length >= 8) u.loginHistory.pop();
            u.loginHistory.unshift({
              dateTime:  (new Date()).toString(),
              userAgent: userData.userAgent
            });
            return User.updateOne(
              { userName: u.userName },
              { $set: { loginHistory: u.loginHistory } }
            );
          })
          .then(() => resolve(u))
          .catch(err => {
            if (err.message.match(/bcrypt/i)) reject('There was an error validating the password');
            else                              reject(`There was an error verifying the user: ${err}`);
          });
      })
      .catch(() => reject(`Unable to find user: ${userData.userName}`));
  });
};
