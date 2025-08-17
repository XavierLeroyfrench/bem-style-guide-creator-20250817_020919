const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/User'); // Assuming you have a User model defined

class UserAuthenticationModule {
    constructor() {
        this.secretKey = process.env.JWT_SECRET || 'your_secret_key'; // Use environment variable for security
        this.tokenExpiration = '1h'; // Token expiration time
        this.revokedTokens = new Set(); // Simple in-memory blacklist for revoked tokens
    }

    async register(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new UserModel({
            username: userData.username,
            password: hashedPassword,
            email: userData.email
        });
        await newUser.save();
        return this.createToken(newUser);
    }

    async login(username, password) {
        const user = await UserModel.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid login credentials');
        }
        return this.createToken(user);
    }

    logout(token) {
        this.revokedTokens.add(token); // Add token to the blacklist
        return true; // Placeholder for potential logout mechanics
    }

    isAuthenticated(token) {
        if (this.revokedTokens.has(token)) {
            return false; // Token is revoked
        }
        try {
            const payload = jwt.verify(token, this.secretKey);
            return payload;
        } catch (error) {
            return false;
        }
    }

    createToken(user) {
        const payload = { id: user._id }; // Only include non-sensitive information
        return jwt.sign(payload, this.secretKey, { expiresIn: this.tokenExpiration });
    }
}

module.exports = new UserAuthenticationModule();