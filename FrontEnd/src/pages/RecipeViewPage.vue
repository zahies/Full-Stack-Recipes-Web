<template>
  <div @mousemove="clearTimeoutFunc()" class="container">
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
                {{ r.original }}
              </li>
            </ul>
          </div>
          <div class="wrapped">
            Instructions:
            <ol>
              <li v-for="(s, index) in recipe._instructions" :key="index">
                {{ s }}
              </li>
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
      favoriteImg: "false.png",
      user: false,
      DBID: null,
      vegan: false,
      gluten: false,
    };
  },
  methods: {
    clearTimeoutFunc(timeout) {
      console.log("mouseee");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        //Log out the user
        this.$root.store.logout();
        console.log("sadasd");
      }, 10 * 60 * 1000);
    },
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
      let response;

      try {
        response = await this.axios.get(
          `http://localhost:4000/recipes/fullrecipeinfo/id/${this.$route.params.recipeId}`
        );
        this.DBID = response.data[0].DBID[0].RecipeID;
        if (localStorage.getItem("username")) {
          this.user = true;

          let fav = await this.axios.post(
            `http://localhost:4000/user/seeRecipe`,
            {
              id: response.data[0].DBID[0].RecipeID,
              username: localStorage.getItem("username"),
            }
          );

          console.log(fav.data);
          if (fav.data === true) {
            this.favoriteImg = "true.png";
          } else {
            this.favoriteImg = "false.png";
          }
          console.log(this.favoriteImg);
        }
        console.log(response);
        if (response.status !== 200) this.$router.replace("/NotFound");
      } catch (error) {
        console.log("error.response.status", error.response.status);
        this.vegan = response.data[0].vegan;
        this.gluten = response.data[0].glutenFree;
        console.log(this.vegan);
        console.log(this.gluten);
        this.$router.replace("/NotFound");
        this.vegan = this.recipe.vegan;
        this.gluten = this.recipe.glutenFree;
        console.log(this.vegan);
        console.log(this.gluten);
        return;
      }

      let {
        instructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title,
      } = response.data[0];

      let _instructions = instructions.split("<li>");
      _instructions = instructions.split(".");
      // _instructions = _instructions.slice(1);
      for (var i = 0; i < _instructions.length; i++) {
        _instructions[i] = _instructions[i].replace("</li>", "");
        _instructions[i] = _instructions[i].replace("</ol>", "");
        _instructions[i] = _instructions[i] + ".";
      }
      _instructions.splice(-1, 1);

      let _recipe = {
        _instructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title,
      };

      this.recipe = _recipe;
      console.log(this.recipe);
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
