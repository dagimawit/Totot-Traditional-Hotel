const express = require('express');
const foodrouter = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
    getfood,
    getfoods,
    createfood,
    updatefood,
    deletefood,
    commentfood,
    likefood
} = require('../controllers/foodController')


foodrouter.route('/').get(getfoods);
foodrouter.route('/:id').get(getfood);
foodrouter.route('/create').post(auth,admin,createfood);
foodrouter.route('/:id').put(auth,admin,updatefood);
foodrouter.route('/:id').delete(auth,admin,deletefood);
foodrouter.route('/:id/like').post(auth,likefood)
foodrouter.route('/:id/comments').post(auth, commentfood);

module.exports = foodrouter;
   
