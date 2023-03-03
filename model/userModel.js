const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const jwt = require ('jsonwebtoken');
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  biz: {
    type: Boolean,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  cards: Array
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, biz: this.biz }, config.get('jwtKey'));
    return token;
}

const UserModel = mongoose.model("users" ,userSchema);


function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required(),
    biz: Joi.boolean().required(),
  });

  return schema.validate(user);
}

function validateCard (data){
  const schema = Joi.object({
    cards:Joi.array().min(1).required()
  });
  return schema.validate(data);
};

exports.UserModel = UserModel;
exports.validate = validateUser;
exports.validateCard = validateCard;