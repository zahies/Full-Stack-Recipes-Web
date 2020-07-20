var express = require("express");
var router = express.Router();
var users_util = require("../utils/users_util");
var recipes_utils = require("../utils/recipes_utils");
var bodyParser = require("../node_modules/body-parser");
router.use(bodyParser());

router.use(async (req, res, next) => {
  if (req.session && req.session.id) {
    const id = req.session.id;
    var user1 = await users_util.retrieveUserFromDB(id);
  }
  if (user1) {
    req.user1 = user1;
    next();
  } else {
    res.sendStatus(401).send(" you're not logged in ! ");
  }
});

router.get("/myRecipes", async (req, res) => {
  const myRecipes = await users_util.getUserRecipes(req.session.id);
  if (myRecipes === null) {
    res.status(401).send("something went wrong");
  } else {
    res.status(200).send(myRecipes);
  }
});

router.get("/myFamilyRecipes", async (req, res) => {
  const myRecipes = await users_util.getUserFamilyRecipes(req.session.id);
  if (myRecipes === null) {
    res.status(401).send("something went wrong");
  } else {
    res.status(200).send(myRecipes);
  }
});

router.get("/lastwatchedrecipes", async (req, res) => {
  const lastThreeRecipes = await users_util.getThreeLastRecipes(req.session.id);
  let promises = [];

  for (const rec of lastThreeRecipes) {
    const ans = await recipes_utils.isAPIRecipe(rec.RecipeID);
    if (ans === true) {
      let API_id = await recipes_utils.getAPIidByDBid(rec.RecipeID);
      promises.push(recipes_utils.getInfoRecipe(API_id));
    } else {
      promises.push(recipes_utils.getRecipeFromDB(rec.RecipeID));
    }
  }
  let lastThreeRecipesInfo = await Promise.all(promises);
  res.status(200).send(lastThreeRecipesInfo);
});

router.get("/fullPreviewRecipe/id/:id", async (req, res) => {
  const id = req.params;
  let recipe;
  if (await recipes_utils.isAPIRecipe(id.id)) {
    const API_id = await recipes_utils.getAPIidByDBid(id.id);
    recipe = await users_util.getInfoFullRecipe(API_id);
    if (recipe) {
      let username = req.user1[0].Username;
      if (!(await users_util.checkIfRecipeExist(API_id))) {
        await users_util.insertToRecipes(recipe);
      }
      await users_util
        .getOurIDFromDB(API_id)
        .then((ourID) => users_util.insertSeenDate(ourID, username))
        .catch((error) => console.log(error));
      res.status(200).send(recipe);
    } else {
      res.status(500).send("recipe not found :( ");
    }
  } else if (await recipes_utils.isPersonalRecipe(id.id)) {
    recipe = await users_util.getInfoFullPersonalRecipe(id);
    if (recipe) {
      let username = req.user1[0].Username;
      await users_util
        .getOurIDFromDB2(id)
        .then((ourID) => users_util.insertSeenDate(ourID, username));
      res.status(200).send(recipe);
    } else {
      res.status(500).send("recipe not found :( ");
    }
  } else if (await recipes_utils.isFamilyRecipe(id.id)) {
    recipe = await users_util.getInfoFullFamilyRecipe(id);
    if (recipe) {
      let username = req.user1[0].Username;
      await users_util
        .getOurIDFromDB2(id)
        .then((ourID) => users_util.insertSeenDate(ourID, username));
      res.status(200).send(recipe);
    } else {
      res.status(500).send("recipe not found :( ");
    }
  } else {
    res.status(500).send("recipe not found :( ");
  }
});

router.get("/getFavoriteRecipes", async (req, res) => {
  const favoriteRecipes = await users_util.getFavoriteRecipes(req.session.id);
  let promises = [];

  for (const rec of favoriteRecipes) {
    const ans = await recipes_utils.isAPIRecipe(rec.RecipeID);
    if (ans === true) {
      let API_id = await recipes_utils.getAPIidByDBid(rec.RecipeID);
      promises.push(recipes_utils.getInfoRecipe(API_id));
    } else {
      promises.push(recipes_utils.getRecipeFromDB(rec.RecipeID));
    }
  }
  let favoriteRecipesInfo = await Promise.all(promises);
  res.status(200).send(favoriteRecipesInfo);
});

router.post("/addRecipeToFavorites", async (req, res) => {
  let id = req.body.id;
  let name = req.body.username;
  let action = 1;
  const ans = await users_util.updateRecipeFavorite(id, name, action);

  if (ans === true) {
    res.status(200).send("ok");
  } else {
    res.status(401).send("wrong input");
  }
});

router.post("/removeRecipeFromFavorites", async (req, res) => {
  let id = req.body.id;
  let name = req.body.username;
  let action = 0;
  const ans = await users_util.updateRecipeFavorite(id, name, action);

  if (ans === true) {
    res.status(200).send("ok");
  } else {
    res.status(401).send("wrong input");
  }
});

router.get("/recipeinfo/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let recipe;
    if (recipes_utils.isAPIRecipe(id) === true) {
      recipe = await recipes_utils.getInfoRecipe(id);
    } else {
      recipe = await recipes_utils.getRecipeFromDB(id);
    }
    if (!recipe) {
      throw { status: 401, message: "Incorrect details, recipe not found !" };
    } else {
      let flag = await users_util.isFavorite(id, req.session.id);
      if (flag === true) {
        recipe[0]["favorite"] = "true";
      } else {
        recipe[0]["favorite"] = "false";
      }
      let seenFlag = await users_util.isSeen(id, req.session.id);
      if (seenFlag === true) {
        recipe[0]["seen"] = "true";
      } else {
        recipe[0]["seen"] = "false";
      }
      res.status(200).send(recipe);
    }
  } catch (error) {
    res.status(401).send(message);
  }
});

router.post("/seeRecipe", async (req, res) => {
  let id = [
    {
      RecipeID: req.body.id,
    },
  ];
  let name = req.body.username;
  try {
    let uid = req.user1[0].UserID;
    users_util.insertSeenDate(id, name);
    let fav = await users_util.isFavorite(id, uid);
    res.status(200).send(fav);
  } catch {
    res.status(401).send("something went wrong");
  }
});

router.get("/seenRecipe/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let ourRecID = await users_util.getOurIDFromDB(id);
    if (ourRecID.length > 0) {
      let username = await users_util.getUserIDByname(req.user1[0].Username);
      let isSeen = await users_util.isSeen(
        ourRecID[0].RecipeID,
        username[0].UserID
      );
      res.status(200).send(isSeen);
    } else {
      res.status(200).send(false);
    }
  } catch {
    res.status(401).send("something went wrong");
  }
});

router.get("/favRecipe/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let ourRecID = await users_util.getOurIDFromDB(id);
    if (ourRecID.length > 0) {
      let username = await users_util.getUserIDByname(req.user1[0].Username);
      let isSeen = await users_util.isFavorite(ourRecID, username[0].UserID);
      res.status(200).send(isSeen);
    } else {
      res.status(200).send(false);
    }
  } catch {
    res.status(401).send("something went wrong");
  }
});

router.post("/logout", (req, res) => {
  req.user = null;
});

// router.use(function (req,res,next) {
//     res.sendFile(path.join(__dirname + "/login.html"));
// })

module.exports = router;
