import Main from "./pages/MainPage";
import NotFound from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage"),
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "/user/favoriteRecipes",
    name: "favoriteRecipes",
    component: () => import("./pages/FavoriteRecipesPage.vue")
  },
  {
    path: "/user/myRecipes",
    name: "myRecipes",
    component: () => import("./pages/MyRecipesPage.vue")
  },
  {
    path: "/user/familyRecipes",
    name: "familyRecipes",
    component: () => import("./pages/FamilyRecipesPage.vue")
  },
  {
    path: "/user/fullPreviewRecipe/id/:recipeId",
    name: "userRecipe",
    component: () => import("./pages/DBRecipePage.vue")
  },
  {
    path: "/about",
    name: "about",
    component: ()=> import("./pages/About.vue")
  },
  {
    path: "*",
    name: "notFound",
    component: NotFound,
  }
];

export default routes;
