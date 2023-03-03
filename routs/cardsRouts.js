const express = require('express');
const _ = require('lodash');
const {CardModel, validateCard, generateBizNumber} = require ('../model/card');
const auth = require('../middleware/auth');
const router = express.Router();

//DELET http://localhost:5000/api/cards/:id - delete a spesific card

router.delete('/id', auth, async (req,res) =>{
    const card = await CardModel.findOneAndRemove({_id: req.params.id, user_id: req.user._id});
    if (!card) return res.status(404).send('The card with the given ID wasnt found');
    res.send(card);
});

//PUT http://localhost:5000/api/cards/:id - updat a spesific card

router.put('/id', auth, async (req,res) =>{
    const { error } = validateCard(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let card = await CardModel.findOneAndUpdate ({_id: req.params.id, user_id: req.user._id}, req.body);
    if (!card) return res.status(404).send('The card with the given ID wasnt found');

    card = await CardModel.findOne({_id: req.params.id, user_id: req.user.id});
    res.send(card);

});


//GET http://localhost:5000/api/cards/:id - found spesific card by id

router.get('/:id', auth, async (req,res) =>{
    const card = await CardModel.findOne({_id: req.params.id, user_id: req.user._id});
    if (!card) return res.status(404).send('The card with the given ID wasnt found');
    res.send(card);

});



//POST http://localhost:5000/api/cards - save a new card

router.post("/",auth ,async (req, res) =>{

    const { error } = validateCard(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let card = new CardModel(
        {

        bizName: req.body.bizName,
        bizzDescription: req.body.bizzDescription,
        bizzAddress: req.body.bizzAddress,
        bizPhone: req.body.bizPhone,
        bizImage: req.body.bizImage ? req.body.bizImage : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        bizNumber: await generateBizNumber(CardModel),
        user_id: req.user._id 

    });

    post = await card.save();
    res.send (post);  

});
   

   


module.exports = router;