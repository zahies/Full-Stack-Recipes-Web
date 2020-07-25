<template>
  <div class="container">
    <div v-if="recipe">
      <div class="recipe-header mt-3 mb-4">
        <h1>{{ recipe.title }}</h1>
        <img :src="recipe.image" class="center" />
      </div>
      <div class="recipe-body">
        <div class="wrapper">
          <div class="wrapped">
            <div class="mb-3">
              <div>Ready in {{ recipe.readyInMinutes }} minutes</div>
              <div>Likes: {{ recipe.aggregateLikes }} likes</div>
              <div v-if="family">Author: {{ recipe.author }}</div>
              <div v-if="family">
                Traditionally Cooked At: {{ recipe.WhenToCock }}
              </div>
              <br />
              <b-row>
                <div @click="changeFavorite()">
                  <img
                    v-if="user"
                    v-bind:src="require('../assets/' + favoriteImg)"
                  />
                </div>
                <b-col v-if="vegan">
                  <img src="../assets/Vegan.png" />
                </b-col>
                <b-col v-if="gluten">
                  <img src="../assets/GlutenFree.png" />
                </b-col>
              </b-row>
            </div>
            Ingredients:
            <ul>
              <li
                v-for="(r, index) in recipe.extendedIngredients"
                :key="index + '_' + r.id"
              >
                {{ r.Amount }} {{ r.MeasurementUnit }} {{ r.Name }}
              </li>
            </ul>
          </div>
          <div class="wrapped">
            Instructions:
            <ol>
              {{
                recipe.instructions
              }}
              <!--<li v-for="(s, index) in recipe._instructions" :key="index">
                {{ s }}
              </li>-->
            </ol>
          </div>
        </div>
      </div>
      <!-- <pre>
      {{ $route.params }}
      {{ recipe }}
    </pre
      > -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipe: null,
      family: false,
      favoriteImg: "false.png",
      user: false,
      DBID: null,
      vegan: false,
      gluten: false,
    };
  },
  methods: {
    async changeFavorite() {
      console.log(this.DBID);
      if (this.favoriteImg === "true.png") {
        this.favoriteImg = "false.png";
        await this.axios.post(
          `http://localhost:4000/user/removeRecipeFromFavorites`,
          {
            id: this.DBID,
            username: localStorage.getItem("username"),
          }
        );
      } else {
        this.favoriteImg = "true.png";
        await this.axios.post(
          `http://localhost:4000/user/addRecipeToFavorites`,
          {
            id: this.DBID,
            username: localStorage.getItem("username"),
          }
        );
      }
    },
  },
  async created() {
    try {
      let sessionStorageRecipe = JSON.parse(
        sessionStorage.getItem(this.$route.params.recipeId)
      );
      if (sessionStorageRecipe) {
        this.recipe = sessionStorageRecipe;
      } else {
        let response;
        console.log(!isNaN(`${this.$route.params.recipeId}`));
        try {
          if (!isNaN(this.$route.params.recipeId)) {
            response = await this.axios.get(
              `http://localhost:4000/recipes/fullrecipeinfo/id/${this.$route.params.recipeId}`
            );
            this.DBID = response.data[0].DBID[0].RecipeID;
            let arraySize = response.data[0].extendedIngredients.length;
            let _extendedIngredients = [];
            for (let i = 0; i < arraySize; i++) {
              _extendedIngredients[i] = {
                Amount: response.data[0].extendedIngredients[i].amount,
                Name: response.data[0].extendedIngredients[i].name,
                MeasurementUnit:
                  response.data[0].extendedIngredients[i].measures.us.unitLong,
              };
            }
            console.log(_extendedIngredients);

            response.data[0].extendedIngredients = _extendedIngredients;
          } else {
            response = await this.axios.get(
              `http://localhost:4000/user/fullPreviewRecipe/id/${this.$route.params.recipeId}`
            );
            this.DBID = response.data[0].id;
          }
          if (response.status !== 200) this.$router.replace("/NotFound");
        } catch (error) {
          console.log("error.response.status", error.response.status);
          this.$router.replace("/NotFound");
          return;
        }
        let author = response.data[0].author;
        if (author) {
          this.family = true;
        }

        if (localStorage.getItem("username")) {
          this.user = true;

          let fav = await this.axios.post(
            `http://localhost:4000/user/seeRecipe`,
            {
              id: this.DBID,
              username: localStorage.getItem("username"),
            }
          );

          console.log(fav.data);
          if (fav.data === true) {
            this.favoriteImg = "true.png";
          } else {
            this.favoriteImg = "false.png";
          }
          //sessionStorage.setItem(this.$route.params.recipeId,JSON.stringify(response.data[0]));
          this.recipe = response.data[0];
          this.vegan = this.recipe.vegan;
          this.gluten = this.recipe.glutenFree;
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
}
.wrapped {
  width: 50%;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.recipe-body {
  background-color: aliceblue;
}
/* .recipe-header{

} */
</style>
