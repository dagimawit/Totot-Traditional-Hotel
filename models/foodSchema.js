const Joi = require("joi");
const mongoose = require("mongoose");

const foodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },
  photo: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    mib: 0,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'likes'
  }],  
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 500,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  Ingredient: {
    type: Array,
    required: true,
  },
  stepsforCooking: {
    type: Array,
    required: true,
  },
  creater: {
    type: String,
    required: true,
  },
  cookingHour: {
    type: String,
    required: true,
  },
  dateOut: {
    type: Date,
    default: Date.now,
    required: true,
  },
},
{ timestamps: true }
);
const foodsModel = mongoose.model("Food", foodSchema);

function validatefood(food) {
  const foodSchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    description: Joi.string().required().min(10).max(1000),
    likes: Joi.boolean(),
    photo: Joi.string().required(),
    price: Joi.number().required(),
    Ingredient: Joi.array().required(),
    stepsforCooking: Joi.array().required(),
    creater: Joi.string().required(),
    cookingHour: Joi.string().required(),
    comments: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        text: Joi.string().required().min(4).max(500),
        date: Joi.date().default(Date.now),
      })
    ),

    dateOut: Joi.date().required(),
  });
  return foodSchema.validate(food);
}
exports.validatefood = validatefood;
exports.foodsModel = foodsModel;
exports.foodSchema = foodSchema;
