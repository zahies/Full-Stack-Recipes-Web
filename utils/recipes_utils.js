const DB = require("../DButils");
require("dotenv").config();
const axios = require("axios");
var express = require("express");

async function getInfoRecipe(id) {
  try {
    const recipeinfo = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        params: {
          apiKey: process.env.spooncular_apiKey,
          includeNutrition: false,
        },
      }
    );

    var relevant_array = [];
    relevant_array.push({
      id: recipeinfo.data.id,
      title: recipeinfo.data.title,
      image: recipeinfo.data.image,
      readyInMinutes: recipeinfo.data.readyInMinutes,
      aggregateLikes: recipeinfo.data.aggregateLikes,
      glutenFree: recipeinfo.data.glutenFree,
      vegan: recipeinfo.data.vegan,
      //vegetarian : recipeinfo.data.vegetarian,
    });

    //console.log(relevant_array);
    //res.status(200).send(relevant_array);
    return relevant_array;
  } catch (error) {
    //res.status(401).send("something went wrong !");
    return null;
  }
}

async function getFullInfoRecipe(id) {
  try {
    const recipeinfo = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        params: {
          apiKey: process.env.spooncular_apiKey,
          includeNutrition: false,
        },
      }
    );

    var relevant_array = [];
    relevant_array.push({
      id: recipeinfo.data.id,
      title: recipeinfo.data.title,
      image: recipeinfo.data.image,
      readyInMinutes: recipeinfo.data.readyInMinutes,
      aggregateLikes: recipeinfo.data.aggregateLikes,
      glutenFree: recipeinfo.data.glutenFree,
      vegan: recipeinfo.data.vegan,
      //vegetarian : recipeinfo.data.vegetarian,
      vegetarian: recipeinfo.data.vegetarian,
      extendedIngredients: recipeinfo.data.extendedIngredients,
      instructions: recipeinfo.data.instructions,
      servings: recipeinfo.data.servings,
    });

    //console.log(relevant_array);
    //res.status(200).send(relevant_array);
    return relevant_array;
  } catch (error) {
    //res.status(401).send("something went wrong !");
    return null;
  }
}

async function getRecipeFromDB(id) {
  const recipeinfo = await DB.execQuery(
    `SELECT * FROM recipes WHERE RecipeID = '${id}'`
  );
  var relevant_array = [];
  relevant_array.push({
    id: recipeinfo[0].RecipeID,
    title: recipeinfo[0].Title,
    image: recipeinfo[0].Picture,
    //healthScore : recipeinfo.data.healthScore,
    readyInMinutes: recipeinfo[0].PreparingTime,
    aggregateLikes: recipeinfo[0].numOfLikes,
    glutenFree: recipeinfo[0].GlutenFree,
    vegan: recipeinfo[0].Vegan,
  });
  return relevant_array;
}

async function isAPIRecipe(RecipeID) {
  try {
    const recipeType = await DB.execQuery(
      `SELECT Type FROM recipes WHERE RecipeID = '${RecipeID}'`
    );
    let found = recipeType[0].Type;
    if (found.localeCompare("API") === 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return null;
  }
}

async function isPersonalRecipe(RecipeID) {
  try {
    const recipeType = await DB.execQuery(
      `SELECT Type FROM recipes WHERE RecipeID = '${RecipeID}'`
    );
    let found = recipeType[0].Type;
    if (found.localeCompare("Personal Recipe") === 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return null;
  }
}

async function isFamilyRecipe(RecipeID) {
  try {
    const recipeType = await DB.execQuery(
      `SELECT Type FROM recipes WHERE RecipeID = '${RecipeID}'`
    );
    let found = recipeType[0].Type;
    if (found.localeCompare("Family Recipe") === 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return null;
  }
}

async function getAPIidByDBid(RecipeID) {
  const API_ID = await DB.execQuery(
    `SELECT API_ID FROM recipes WHERE RecipeID = '${RecipeID}'`
  );
  return API_ID[0].API_ID;
}

module.exports.getInfoRecipe = getInfoRecipe;
module.exports.getFullInfoRecipe = getFullInfoRecipe;
exports.getRecipeFromDB = getRecipeFromDB;
module.exports.isAPIRecipe = isAPIRecipe;
exports.getAPIidByDBid = getAPIidByDBid;
exports.isFamilyRecipe = isFamilyRecipe;
exports.isPersonalRecipe = isPersonalRecipe;
