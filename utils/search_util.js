const axios = require("axios");
const recipes_url = "https://api.spoonacular.com/recipes";
var api = process.env.spooncular_apiKey;
var users_util = require("../utils/users_util");

function checkParamsForQuery(query_params, search_params) {
  const params_list = ["diet", "cuisine", "intolerances"];

  let sfds = query_params.query.diet;

  if (query_params.query["diet"]) {
    search_params.diet = query_params.query["diet"];
  }
  if (query_params.query["cuisine"]) {
    search_params.cuisine = query_params.query["cuisine"];
  }
  if (query_params.query["intolerances"]) {
    search_params.intolerances = query_params.query["intolerances"];
  }

  if (
    search_params.number !== 5 &&
    search_params.number !== 10 &&
    search_params.number !== 15
  ) {
    search_params.number = 5;
  }
  //search_params.push({ apiKey: process.env.spooncular_apiKey});
  console.log(search_params);
}

async function searchForRecipes(search_params) {
  let response = await axios.get(`${recipes_url}/search?apiKey=${api}`, {
    params: {
      query: search_params.query,
      number: search_params.number,
      diet: search_params.diet,
      cuisine: search_params.cuisine,
      intolerances: search_params.intolerances,
      instructionsRequired: search_params.instructionsRequired,
    },
  });

  const IDs = extractIDFromResponse(response);
  console.log(IDs);

  let info_array = await getRcipesInfo(IDs);

  return info_array;
}

function extractIDFromResponse(response) {
  let recipes = response.data.results;
  recipes_id_list = [];
  recipes.map((recipe) => {
    console.log(recipe.title);
    recipes_id_list.push(recipe.id);
  });
  return recipes_id_list;
}

async function getRcipesInfo(IDs) {
  let promises = [];

  IDs.map((id) => {
    promises.push(getInfoRecipe(id));
  });

  let info_response = await Promise.all(promises);
  return info_response;
}

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
      vegetarian: recipeinfo.data.vegetarian,
    });

    await users_util.insertToRecipes(relevant_array);
    //console.log(relevant_array);
    //res.status(200).send(relevant_array);
    return relevant_array;
  } catch (error) {
    //res.status(401).send("something went wrong !");
    return null;
  }
}

exports.checkParamsForQuery = checkParamsForQuery;
exports.searchForRecipes = searchForRecipes;
exports.extractIDFromResponse = extractIDFromResponse;
