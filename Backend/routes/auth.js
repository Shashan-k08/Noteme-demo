const express = require('express');

const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');


router.post('/', [
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
      user = await Userd.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })

      // .then(user => res.json(user))
      // .catch(err=>{console.log(err)
      // res.json({error:'Please enter a unique value for email'})})

      res.json(user);
    } catch (error) {
console.error(error.message);
res.status(500).send("some error occured");
    }
  })
module.exports = router
