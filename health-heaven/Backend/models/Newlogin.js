const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the login schema
const newLoginSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash the password before saving
newLoginSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to find a user by email and validate password
newLoginSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return user;
};

const NewLogin = mongoose.model('Newlogin', newLoginSchema);
module.exports = NewLogin;
