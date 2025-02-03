const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {protect} = require('../middleware/authMiddleware')

/**
* @swagger
* /auth/register:
*   post:
*     summary: Register a new user
*     description: Creates a new user account.
*     tags: [Authentication]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UserRegisterInput'
*     responses:
*       201:
*         description: User registered successfully.
*       400:
*         description: Invalid input or username already exists.
*       401:
*         description: Not authorized, token failed.
*/
router.post('/register',protect, async (req, res) => {
   const { username, password, isAdmin } = req.body;

   try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
        }

        const user = new User({ username, password, isAdmin: isAdmin});
        await user.save();

    res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
    res.status(400).json({ message: err.message });
    }
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user and returns a JWT.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginInput'
 *     responses:
 *       200:
 *         description: User logged in successfully. Returns a JWT.
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                   token:
 *                       type: string
 *                       description: JWT for authentication
 *       400:
 *         description: Invalid credentials.
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
        res.json({ token: token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;