const express = require("express");
const bcrypt = require ("bcrypt");
const _ = require("lodash");
const { UserModel, validate} = require("../model/userModel");
const {CardModel} = require('../model/card');
const auth = require('../middleware/auth');
const router = express.Router();



const getCards = async (cardsArray) => {
    const cards = await CardModel.find({ "bizNumber": { $in: cardsArray } });
    return cards;
};

// GET http://localhost:5000/api/users/cards - all saved cards by manager

router.get('/cards', auth, async (req, res) => {
 
    if (!req.query.numbers) res.status(400).send('Missing numbers data');
   
    let data = {};
    data.cards = req.query.numbers.split(",");
   
    const cards = await getCards(data.cards);
    res.send(cards);
   
});

// http://localhost:5000/api/users/cards - save cards
   
  router.patch('/cards', auth, async (req, res) => {
   
    const { error } = validateCards(req.body);
    if (error) res.status(400).send(error.details[0].message);
   
    const cards = await getCards(req.body.cards);
    if (cards.length != req.body.cards.length) res.status(400).send("Card numbers don't match");
   
    let user = await UserModel.findById(req.user._id);
    user.cards = req.body.cards;
    user = await user.save();
    res.send(user);
   
});


//GET http://localhost:5000/api/users/me - get details by token number
router.get('/me', auth, async (req, res) =>{
    const user = await UserModel.findById(req.user._id).select('-password');
    res.send(user);
});

//POST http://localhost:5000/api/users - creat a new user - register
router.post("/",async (req, res) =>{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await UserModel.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");
   

   user = new UserModel(_.pick(req.body, ['name', 'email','password', 'biz', 'cards']));

    const salt = await bcrypt .genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email']));
});


//GET http://localhost:5000/api/users - working test
router.get("/",async(request, response) =>{
    response.json("success");
});


module.exports = router;