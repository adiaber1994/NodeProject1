const jwt = require ('jsonwebtoken');
const config = require('config');
const { request, response } = require('express');
const { invalid } = require('@hapi/joi');
const { UserModel } = require('../model/userModel');


module.exports = (request, response, next) =>{
    const token = request.header ('x-auth-token');
    if (!token) return response.status(401).send('No token provided');

    try {
        const decoded = jwt.verify(token, config.get('jwtKey'));
        request.user = decoded
        next();
    }
    catch(ex) {
        response.status(400).send ('invalid token');
    };
};