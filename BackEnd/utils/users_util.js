const DB = require("../DButils");
var recipes_utils = require("../utils/recipes_utils");
const axios = require("axios");

async function retrieveUserFromDB(id) {
  const users_id = await DB.execQuery(`SELECT UserID FROM users`);
  let found = users_id.find((x) => x.UserID === id);
  if (found) {
    let user = await DB.execQuery(`SELECT * FROM users WHERE UserID = '${id}'`);
    return user;
  } else {
    return null;
  }
}

async function getThreeLastRecipes(id) {
  let name = await DB.execQuery(
    `SELECT Username From users WHERE UserID = '${id}'`
  );
  if (name.length === 0) {
    return null;
  }
  const three_last_id = await DB.execQuery(
    `SELECT top 3 RecipeID from dbo.user_recipes WHERE UserName = '${name[0].Username}' order by SeenDate desc`
  );
  if (three_last_id) {
    return three_last_id;
  } else {
    return null;
  }
}

async function getFavoriteRecipes(id) {
  let name = await DB.execQuery(
    `SELECT Username From users WHERE UserID = '${id}'`
  );
  if (name.length === 0) {
    return null;
  }
  const favorite_id = await DB.execQuery(
    `SELECT RecipeID from dbo.user_recipes WHERE UserName = '${name[0].Username}' and FavoriteFlag = 1 order by SeenDate desc`
  );
  if (favorite_id) {
    return favorite_id;
  } else {
    return null;
  }
}

async function getUserIDByname(name) {
  const user_id = await DB.execQuery(
    `SELECT UserID FROM users WHERE Username = '${name}'`
  );
  return user_id;
}

async function updateRecipeFavorite(id, name, action) {
  const ans = await DB.execQuery(
    `SELECT * FROM user_recipes WHERE Username = '${name}' and RecipeID = '${id}'`
  );
  if (ans.length === 0) {
    return false;
  }
  try {
    const ans1 = await DB.execQuery(
      `UPDATE user_recipes SET FavoriteFlag = '${action}' WHERE UserName = '${name}' and RecipeID = '${id}'`
    );
    return true;
  } catch (err) {
    return false;
  }
}

async function getUserRecipes(id) {
  let name = await DB.execQuery(
    `SELECT Username From users WHERE UserID = '${id}'`
  );
  if (name.length === 0) {
    return null;
  }
  const myRecipes = await DB.execQuery(
    `SELECT RecipeID FROM dbo.user_recipes WHERE UserName = '${name[0].Username}'`
  );
  let promises = [];
  for (rec of myRecipes) {
    if (!(await recipes_utils.isAPIRecipe(rec.RecipeID)) === true) {
      promises.push(recipes_utils.getRecipeFromDB(rec.RecipeID));
    }
  }
  return Promise.all(promises);
}

async function getUserFamilyRecipes(id) {
  let name = await DB.execQuery(
    `SELECT Username From users WHERE UserID = '${id}'`
  );
  if (name.length === 0) {
    return null;
  }
  const myRecipes = await DB.execQuery(
    `SELECT RecipeID FROM dbo.user_recipes WHERE UserName = '${name[0].Username}'`
  );
  let promises = [];
  for (rec of myRecipes) {
    if ((await recipes_utils.isFamilyRecipe(rec.RecipeID)) === true) {
      promises.push(recipes_utils.getRecipeFromDB(rec.RecipeID));
    }
  }
  return Promise.all(promises);
}

async function getInfoFullRecipe(id) {
  var ID = parseInt(id);
  try {
    const recipeinfo1 = await axios.get(
      `https://api.spoonacular.com/recipes/${ID}/information`,
      {
        params: {
          apiKey: process.env.spooncular_apiKey,
          includeNutrition: false,
        },
      }
    );

    var relevant_array = [];
    relevant_array.push({
      id: recipeinfo1.data.id,
      title: recipeinfo1.data.title,
      image: recipeinfo1.data.image,
      readyInMinutes: recipeinfo1.data.readyInMinutes,
      aggregateLikes: recipeinfo1.data.aggregateLikes,
      glutenFree: recipeinfo1.data.glutenFree,
      vegan: recipeinfo1.data.vegan,
      vegetarian: recipeinfo1.data.vegetarian,
      extendedIngredients: recipeinfo1.data.extendedIngredients,
      instructions: recipeinfo1.data.instructions,
      servings: recipeinfo1.data.servings,
    });

    //console.log(relevant_array);
    //res.status(200).send(relevant_array);
    return relevant_array;
  } catch (error) {
    //res.status(401).send("something went wrong !");
    console.log(error);
    return null;
  }
}

async function getInfoFullPersonalRecipe(id) {
  try {
    const recipeinfo = await DB.execQuery(
      `SELECT * FROM recipes WHERE RecipeID ='${id.id}'`
    );
    const recIndgridients = await DB.execQuery(
      `SELECT * FROM recipe_ingredients WHERE RecipeID = '${id.id}'`
    );

    var relevant_array = [];
    relevant_array.push({
      id: recipeinfo[0].RecipeID,
      title: recipeinfo[0].Title,
      image: recipeinfo[0].Picture,
      readyInMinutes: recipeinfo[0].PreparingTime,
      aggregateLikes: recipeinfo[0].numOfLikes,
      glutenFree: recipeinfo[0].GlutenFree,
      vegan: recipeinfo[0].Vegan,
      extendedIngredients: recIndgridients,
      instructions: recipeinfo[0].Instructions,
      servings: recipeinfo[0].Servings,
    });
    return relevant_array;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getInfoFullFamilyRecipe(id) {
  try {
    const recipeinfo = await DB.execQuery(
      `SELECT * FROM recipes WHERE RecipeID ='${id.id}'`
    );
    const recIndgridients = await DB.execQuery(
      `SELECT * FROM recipe_ingredients WHERE RecipeID = '${id.id}'`
    );
    const familyInfo = await DB.execQuery(
      `SELECT * FROM family_recipes WHERE RecipeID ='${id.id}'`
    );

    var relevant_array = [];
    relevant_array.push({
      id: recipeinfo[0].RecipeID,
      title: recipeinfo[0].Title,
      image: recipeinfo[0].Picture,
      readyInMinutes: recipeinfo[0].PreparingTime,
      aggregateLikes: recipeinfo[0].numOfLikes,
      glutenFree: recipeinfo[0].GlutenFree,
      vegan: recipeinfo[0].Vegan,
      extendedIngredients: recIndgridients,
      instructions: recipeinfo[0].Instructions,
      servings: recipeinfo[0].Servings,
      author: familyInfo[0].Author,
      WhenToCock: familyInfo[0].WhenToCock,
    });
    return relevant_array;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const insertSeenDate = async function (id, userName) {
  let exist1 = await DB.execQuery(
    `SELECT * FROM [dbo].[user_recipes] WHERE RecipeID =  '${id[0].RecipeID}'`
  );
  let favorite = await DB.execQuery(
    `SELECT FavoriteFlag FROM [dbo].[user_recipes] WHERE RecipeID = '${id[0].RecipeID}'`
  );
  return new Promise((res, rej) => {
    try {
      if (exist1.length > 0) {
        DB.execQuery(
          `UPDATE dbo.user_recipes SET SeenDate = CURRENT_TIMESTAMP WHERE RecipeID = '${id[0].RecipeID}'`
        );
        // if (favorite[0].FavoriteFlag === false){
        //     DB.execQuery(`INSERT INTO [dbo].[user_recipes] (RecipeID, UserName, SeenFlag, FavoriteFlag, SeenDate) VALUES ('${id[0].RecipeID}','${userName}',1,0,CURRENT_TIMESTAMP)`)
        // }else{
        //     DB.execQuery(`INSERT INTO [dbo].[user_recipes] (RecipeID, UserName, SeenFlag, FavoriteFlag, SeenDate) VALUES ('${id[0].RecipeID}','${userName}',1,1,CURRENT_TIMESTAMP)`)
        // }
      } else {
        DB.execQuery(
          `INSERT INTO [dbo].[user_recipes] (RecipeID, UserName, SeenFlag, FavoriteFlag, SeenDate) VALUES ('${id[0].RecipeID}','${userName}',1,0,CURRENT_TIMESTAMP)`
        );
      }
      res("inserted successfully ! :D");
    } catch (error) {
      rej(error);
    }
  });
};

async function checkIfRecipeExist(id) {
  var ID = parseInt(id);
  let exist = await DB.execQuery(
    `SELECT * FROM recipes WHERE API_ID =  '${ID}'`
  );
  if (exist.length > 0) {
    return true;
  } else {
    return false;
  }
}

async function insertToRecipes(recipe) {
  try {
    let exitsID = await DB.execQuery(
      `SELECT RecipeID from [dbo].[recipes] WHERE API_ID = '${recipe[0].id}'`
    );
    if (exitsID.length > 0) {
      return exitsID;
    }
    await DB.execQuery(
      `INSERT INTO [dbo].[recipes] (Type, API_ID) VALUES ('API','${recipe[0].id}')`
    );
    let ourID = await DB.execQuery(
      `SELECT Top 1 RecipeID FROM recipes where API_ID='${recipe[0].id}'`
    );
    return ourID;
  } catch (error) {
    console.log(error);
  }
}

const getOurIDFromDB = function (id) {
  return new Promise((res, rej) => {
    var ID = parseInt(id);
    let idE = DB.execQuery(
      `SELECT RecipeID FROM recipes WHERE API_ID =  '${ID}'`
    );
    if (idE) {
      res(idE);
    } else {
      rej("something went wrong ! ");
    }
  });
};
const getOurIDFromDB2 = function (id) {
  return new Promise((res, rej) => {
    let idE = DB.execQuery(
      `SELECT RecipeID FROM recipes WHERE RecipeID =  '${id.id}'`
    );
    if (idE) {
      res(idE);
    } else {
      rej("something went wrong ! ");
    }
  });
};

async function isFavorite(recID, user_id) {
  let name = await DB.execQuery(
    `SELECT Username From users WHERE UserID = '${user_id}'`
  );
  const ans = await DB.execQuery(
    `SELECT FavoriteFlag FROM user_recipes WHERE UserName = '${name[0].Username}' and RecipeID = '${recID[0].RecipeID}'`
  );
  if (ans.length === 0) {
    return false;
  }
  return ans[0].FavoriteFlag;
}

async function isSeen(recID, user_id) {
  let name = await DB.execQuery(
    `SELECT Username From users WHERE UserID = '${user_id}'`
  );
  const ans = await DB.execQuery(
    `SELECT * FROM user_recipes WHERE UserName = '${name[0].Username}' and RecipeID = '${recID}'`
  );
  if (ans.length === 0) {
    return false;
  } else {
    return true;
  }
}

exports.getOurIDFromDB = getOurIDFromDB;
exports.insertToRecipes = insertToRecipes;
exports.checkIfRecipeExist = checkIfRecipeExist;
exports.insertSeenDate = insertSeenDate;
exports.getInfoFullRecipe = getInfoFullRecipe;
exports.retrieveUserFromDB = retrieveUserFromDB;
exports.getThreeLastRecipes = getThreeLastRecipes;
exports.getUserIDByname = getUserIDByname;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.updateRecipeFavorite = updateRecipeFavorite;
exports.getUserRecipes = getUserRecipes;
exports.getUserFamilyRecipes = getUserFamilyRecipes;
exports.isFavorite = isFavorite;
exports.isSeen = isSeen;
exports.getInfoFullPersonalRecipe = getInfoFullPersonalRecipe;
exports.getInfoFullFamilyRecipe = getInfoFullFamilyRecipe;
exports.getOurIDFromDB2 = getOurIDFromDB2;
