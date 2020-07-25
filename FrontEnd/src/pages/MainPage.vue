<template>
  <div @mousemove="clearTimeoutFunc()" class="container">
    <h1 class="title">Main Page</h1>

    <b-row>
      <b-col >
        <RecipePreviewList  title="Random Recipes" class="RandomRecipes center" />

      </b-col>
      <b-col style="float : left">
          <img src="../assets/logo1.png" />
      </b-col>
      <b-col style="float:right">
        <router-link v-if="!$root.store.username" to="/login" tag="button">For Registered Members Only</router-link>
        <MyRecipesList
          title="Last Viewed Recipes"
          v-bind:recipes="lastViewedRecipes"
          :class="{
            blur: !$root.store.username,
            center: true,
          }"
          disabled
        ></MyRecipesList>
      </b-col>
    </b-row>
    <!-- <div
      style="position: absolute;top: 70%;left: 50%;transform: translate(-50%, -50%);"
    >
      Centeredasdasdad
    </div>-->
  </div>
</template>

<script>
import RecipePreviewList from "../components/RecipePreviewList";
import MyRecipesList from "../components/MyRecipesList";
export default {
  components: {
    RecipePreviewList,
    MyRecipesList,
  },
  data() {
    return {
      randomRecipes: [],
      lastViewedRecipes: [],
      timeout: undefined,
    };
  },
  created() {
    this.updateLastViewed();
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
    async updateLastViewed() {
      try {
        const response = await this.axios.get(
          "http://localhost:4000/user/lastwatchedrecipes"
        );
        const recipes = response.data;
        let arrayLength = recipes.length;
        this.lastViewedRecipes = [];
        for (let i = 0; i < arrayLength; i++) {
          this.lastViewedRecipes.push(recipes[i][0]);
        }
        console.log(this.lastViewedRecipes);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.RandomRecipes {
  margin: 10px 0 10px;
}
.blur {
  -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
  filter: blur(2px);
}
::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}
</style>
