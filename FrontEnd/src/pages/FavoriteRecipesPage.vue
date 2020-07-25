<template>
  <div @mousemove="clearTimeoutFunc()" class="container">
    <MyRecipesList title="Favorite Recipes" v-bind:recipes="myRecipes" />
  </div>
</template>

<script>
import MyRecipesList from "../components/MyRecipesList";
export default {
  data() {
    return {
      myRecipes: [],
      timeout: undefined,
    };
  },
  components: {
    MyRecipesList,
  },
  created() {
    this.updateMyRecipes();
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
    async updateMyRecipes() {
      try {
        const response = await this.axios.get(
          "http://localhost:4000/user/getFavoriteRecipes"
        );
        const recipes = response.data;
        let arrayLength = recipes.length;
        this.myRecipes = [];
        for (let i = 0; i < arrayLength; i++) {
          this.myRecipes.push(recipes[i][0]);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
