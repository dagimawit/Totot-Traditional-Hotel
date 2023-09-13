const express = require("express");
const mongoose = require("mongoose");
const { drinksModel, validatedrinks } = require("../models/drinkSchema");
const asyncHandler = require("express-async-handler");
const { usersModel } = require("../models/userSchema");


//to get all the drinks
const getdrinks = asyncHandler(async (req, res) => {
    const drinks = await drinksModel.find().sort("name");
    res.send(drinks);
  });
const getdrink  = asyncHandler (async (req, res) => {
    const drinks = await drinksModel.findById(req.params.id);
  
    if (!drinks) res.status(404).send("The drink with the given id is not found");
  
    res.send(drinks);
  });
const createdrink = asyncHandler(async (req, res) => {
    const { error } = validatedrinks(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    let drinks = new drinksModel(req.body);
    drinks = await drinks.save();
    res.send(drinks);
  });

const updatedrink = asyncHandler(async (req, res) => {
    let { id } = req.params;
  
    const { error } = validatedrinks(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const drinks = await drinksModel.findByIdAndUpdate({ _id: id }, req.body);
    if (!drinks)
      return res.status(404).send("The drink with the given id is not found");
  
    res.send(drinks);
  });

  const deletedrink = asyncHandler(async (req, res) => {
    const drinks = await drinksModel.findByIdAndRemove(req.params.id);
    if (!drinks)
      return res.status(404).send("The drink with the given id is not found");
  
    res.send(drinks);
  });
  const likedrink = asyncHandler(async (req, res) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
  
    try {
      const userId = req.user._id;
      const drinkId = req.params.id;
  
      // Check if user has already liked the food item
      const user = await usersModel.findById(userId);
      if (user.likes.includes(drinkId)) {
        return res.status(400).send("You have already liked this drink item");
      }
      const drink = await drinksModel.findByIdAndUpdate(
        drinkId,
        { $inc: { likes: 1 } },
        { new: true }
      );
  
      if (!drink) {
        return res.status(404).send("The drink with the given id is not found");
      }
      user.likes.push(drinkId);
      await user.save();
  
      res.send(drink);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });
  
  
  const commentdrink = asyncHandler(async (req, res) => {
     if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    try {
      const { text } = req.body;
      const user = req.user.id;
      const drinkId = req.params.id;
  
      const drink = await drinksModel.findByIdAndUpdate(
        drinkId,
        { $push: { comments: { text, user } } },
        { new: true }
      );
  
      if (!drink) {
        return res.status(404).send("The drink with the given id is not found");
      }
  
      res.send(drink.comments);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });
  module.exports = {
    getdrink,
    getdrinks,
    createdrink,
    updatedrink,
    deletedrink,
    likedrink,
    commentdrink
  };
  