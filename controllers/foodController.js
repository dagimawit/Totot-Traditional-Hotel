const express = require("express");
const { foodsModel, validatefood } = require("../models/foodSchema");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { usersModel } = require("../models/userSchema");

const getfoods = asyncHandler(async (req, res) => {
  const food = await foodsModel.find().sort("-dateOut");
  res.status(200).send(food);
});
const getfood = asyncHandler(async (req, res) => {
  const food = await foodsModel.findById(req.params.id);

  if (!food) res.status(404).send("The food with the given id is not found");

  res.send(food);
});
const createfood = asyncHandler(async (req, res) => {
  const { error } = validatefood(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let food = new foodsModel(req.body);
  food = await food.save();
  res.status(201).send(food);
});

const updatefood = asyncHandler(async (req, res) => {
  const { error } = validatefood(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const food = await foodsModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!food)
    return res.status(404).send("The food with the given id is not found");

  res.status(200).send(food);
});

const deletefood = asyncHandler(async (req, res) => {
  const food = await foodsModel.findByIdAndRemove(req.params.id);
  if (!food)
    return res.status(404).send("The food with the given id is not found");

  res.status(200).send(food);
});

// POST /api/foods/:id/like
const likefood = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  const { userId } = req.body;

  try {
    // Check if the food item exists
    const food = await foodsModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    // Check if the user has already liked the food item
    if (food.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this food item" });
    }
    // Add the user's ObjectId to the likes array of the food item
    food.likes.push(userId);
    await food.save();

    res.status(200).json({ message: "Food item liked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

});


const commentfood = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const { text } = req.body;
    const user = req.user.id;
    const foodId = req.params.id;

    const food = await foodsModel.findByIdAndUpdate(
      foodId,
      { $push: { comments: { text, user } } },
      { new: true }
    );

    if (!food) {
      return res.status(404).send("The food with the given id is not found");
    }

    res.send(food.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = {
  getfood,
  getfoods,
  createfood,
  updatefood,
  deletefood,
  likefood,
  commentfood,
};
