const express = require("express");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const drinkrouter = express.Router();
const validateObjectId = require('../middleware/validateObjectid'); 
const {  
   getdrink,
   getdrinks,
   createdrink,
   updatedrink,
   deletedrink,
   likedrink,
   commentdrink,
} = require('../controllers/drinkController')
drinkrouter.route("/").get(getdrinks);

drinkrouter.route("/:id").get(validateObjectId,getdrink);
drinkrouter.route("/create").post(auth,admin,createdrink);
drinkrouter.route("/:id").put(auth,admin,updatedrink);
drinkrouter.route("/:id").delete(auth,admin,deletedrink);
drinkrouter.route(':id/like').post(auth,likedrink);
drinkrouter.route("/:id/comments").post(auth, commentdrink);

module.exports = drinkrouter;
