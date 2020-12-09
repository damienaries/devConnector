const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config');
const { check, validationResult } = require('express-validator'); 

// @route       GET api/auth
// @description Test Route
// @access      Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})


// @route       POST api/auth
// @description Authenticate User & get token
// @access      Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

const { email, password } = req.body;

try {
// see if user exists
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

//match email and password
const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch) {
    return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
}

//Return json webtoken
    const payload = {
        user: {
            id: user.id
        }
    };

jwt.sign(
    payload, 
    config.get('jwtSecret'),
    { expiresIn: 3600000 }, 
    (err, token) => {
        if(err) throw err;
        res.json({ token });
    });


} catch(err) {
    console.log(err.message);
    res.status(500).send('Server Error')
}

}
);



module.exports = router;