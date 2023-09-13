const Joi = require('joi');
const mongoose = require('mongoose');
const objectId = require('joi-objectid');

const drinkSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    price: {
        type: String,
        required: true,
    },
    likes: {
        type: Array,
        default: []
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 500
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    photo: {
        type: String,
        required: true,
    },
    creater: {
        type: String,
        required: true,
    },
    Ingredient: {
        type: Array,
        required: true
    },
    stepsforPreparing: {
        type: Array,
        required: true,
    },
    takingTime: {
        type: String,
        required: true,
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

const drinksModel = mongoose.model('Drink', drinkSchema);

function validatedrinks(drink) {
    const drinkSchema = Joi.object({
        name: Joi.string().required().min(3).max(50),
        description: Joi.string().required().min(10).max(1000),
        likes: Joi.number(),
        photo: Joi.string().required(),
        price: Joi.number().required(),
        Ingredient: Joi.array().required(),
        creater: Joi.string().required(),
        stepsforPreparing: Joi.array().required(),
        takingTime: Joi.string().required(),
        comments: Joi.array().items(Joi.object({
            user: Joi.object().required(),
            text: Joi.string().required().min(4).max(500),
            date: Joi.date().default(Date.now)
        })),
        dateOut: Joi.date().required(),
    });
    return drinkSchema.validate(drink);
}

exports.validatedrinks = validatedrinks;
exports.drinksModel = drinksModel;
exports.drinkSchema = drinkSchema;