require("dotenv").config();
const axios = require("axios");
var express = require("express");
var bodyParser = require("body-parser");
var recipes_utils = require("../utils/recipes_utils");
var users_util = require("../utils/users_util");
var router = express.Router();

//#region promise Version

router.get("/randomRecipes", async (req, res) => {
  try {
    const three_recipe = await axios.get(
      `https://api.spoonacular.com/recipes/random`,
      {
        params: {
          apiKey: process.env.spooncular_apiKey,
          number: 3,
          limitLicense: false,
        },
      }
    );
    let result_array = [3];
    i = 0;
    for (; i < 3; i++) {
      result_array[i] = three_recipe.data.recipes[i];
    }

    let relevant_array = result_array.map((output) => {
      const {
        id,
        title,
        image,
        healthScore,
        readyInMinutes,
        aggregateLikes,
        glutenFree,
        vegan,
        vegetarian,
      } = output;
      return {
        id: id,
        title: title,
        image: image,
        healthScore: healthScore,
        readyInMinutes: readyInMinutes,
        aggregateLikes: aggregateLikes,
        glutenFree: glutenFree,
        vegan: vegan,
        vegetarian: vegetarian,
      };
    });
    //console.log(relevant_array);
    res.status(200).send(relevant_array);
  } catch (error) {
    res.status(401).send("something went wrong !");
  }
});

router.get("/recipeinfo/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //let id = req.query.id;
    let recipe = await recipes_utils.getInfoRecipe(id);
    await users_util.insertToRecipes(recipe);
    if (!recipe) {
      throw { status: 401, message: "Incorrect details, recipe not found !" };
    } else {
      res.status(200).send(recipe);
    }
  } catch (error) {
    res.status(401).send(message);
  }
});

router.get("/fullrecipeinfo/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //let id = req.query.id;
    let recipe = await recipes_utils.getFullInfoRecipe(id);
    let ourID =await users_util.insertToRecipes(recipe);
    recipe[0].DBID = ourID;
    if (!recipe) {
      throw { status: 401, message: "Incorrect details, recipe not found !" };
    } else {
      res.status(200).send(recipe);
    }
  } catch (error) {
    res.status(401).send(message);
  }
});

module.exports = router;
