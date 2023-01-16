const express = require('express');

const User = require('../models/User');
const router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')
const JWT_SECRET = "shhhh";
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),

  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
],
  async (req, res) => {
    // if there are errors then check error and rwturn bad request and that error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check weather user with this email already exist
    try {


      let user = await User.findOne({ email: req.body.email });
      console.log(user);
      if (user) {
        return res.status(400).json({ error: "Sorry a user with this email already exist" })
      }

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      const data = {
        user: {
          id: user.id
        }
      }
      const verificationtoken = jwt.sign(data, JWT_SECRET);

      // .then(user => res.json(user))
      // .catch(err=>{console.log(err)
      // res.json({error:'Please enter a unique value for email'})})

      res.json({ verificationtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  })

router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
],
  async (req, res) => {
    // if there are errors then check error and rwturn bad request and that error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {

      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Please try login with correct crendentials" });
      }

      const passwordcheck = await bcrypt.compare(password, user.password);
      if (!passwordcheck) {
        return res.status(400).json({ error: "Please try login with correct crendentials" });

      }

      const data = {
        user: {
          id: user.id
        }
      }
      const verificationtoken = jwt.sign(data, JWT_SECRET);
      res.json({ verificationtoken });

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  })

  // Rout :3 Get logged in User details using :Post "/api/auth/getuser".Login Required

router.post('/getuser', fetchuser, async (req, res) => {
   try {
    userId =req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
    
   } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
   }

  })
module.exports = router
