const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username }); // Correctly refer to User model here
// Example for logging the user inside findByCredentials method
console.log('Found User:', user);

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
