const { string } = require('@hapi/joi');
const Joi = require('@hapi/joi');
const Joy = require ('@hapi/joi');
const number = require('@hapi/joi/lib/types/number');
const mongoose = require('mongoose');
const { UserModel } = require('./userModel');
const _ = require('lodash');

const cardSchema = new mongoose.Schema({
    bizName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },

    bizzDescription: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024
    },
    bizzAddress:{
        type: String,
        required: true,
        minlength:2,
        maxlength: 400
    },
    bizPhone:{
        type: String,
        required: true,
        minlength: 9,
        maxlength: 10
    },
    bizImage:{
        type: String,
        required: true,
        minlength:10,
        maxlength: 1044
    },
    bizNumber:{
        type: String,
        required: true,
        minlength:3,
        maxlength: 9999999,
        unique: true
    },

    user_id:{ type:mongoose.Schema.Types.ObjectId, ref:UserModel }

});

const CardModel = mongoose.model('Card', cardSchema);

function validateCard(card) {
    const schema = Joi.object({
     bizName: Joi.string().min(2).max(255).required(),
     bizzDescription: Joi.string().min(2).max(1024).required(),
     bizzAddress: Joi.string().min(2).max(400).required(),
     bizPhone: Joi.string().min(9).max(10).required().regex(/^0[2-9]\d{7,8}$/),
     bizImage: Joi.string().min(10).max(1044)
    });
  
    return schema.validate(card);
}

async function generateBizNumber(CardModel) {
    while (true) {
        let randomNumber = _.random(1000, 999999);
        let card = await CardModel.findOne({ bizNumber: randomNumber});
        if (!card) return String (randomNumber);
    }
}

exports.CardModel = CardModel;
exports.validateCard = validateCard;
exports.generateBizNumber = generateBizNumber;