<template>
  <div>
    <router-link :to="{ name: 'userRecipe', params: { recipeId: recipe.id } }">
      <div class="recipe-body" style="width : 10 px">
        <img :src="recipe.image" class="recipe-image" />
      </div>
      <div class="recipe-footer">
        <div :title="recipe.title" class="{ viewedRecipe: seen }">
          {{ recipe.title }}
        </div>
        <ul class="recipe-overview">
          <li>{{ recipe.readyInMinutes }} minutes</li>
          <li>{{ recipe.aggregateLikes }} likes</li>
          <div v-if="user">
            <li v-if="isSeen"><b>seen ✅</b></li>
            <li v-if="isFav"><b> favorite recipe ❤️</b></li>
          </div>
          <b-row>
            <b-col v-if="vegan">
              <img src="../assets/Vegan.png" />
            </b-col>
            <b-col v-if="gluten">
              <img src="../assets/GlutenFree.png" />
            </b-col>
          </b-row>
        </ul>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSeen: 0,
      isFav: 0,
      user: false,
      vegan: false,
      gluten: false,
    };
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.vegan = this.recipe.vegan;
    this.gluten = this.recipe.glutenFree;
  },
  async mounted() {
    if (localStorage.getItem("username")) {
      this.user = true;
    }
    console.log(this.recipe.id);
    try {
      const response = await this.axios.get(
        `http://localhost:4000/user/seenRecipe/${this.recipe.id}`
      );
      //this.$router.push("/search");
      this.isSeen = response.data;
    } catch (err) {
      console.log(err.response);
    }
    try {
      const response = await this.axios.get(
        `http://localhost:4000/user/favRecipe/${this.recipe.id}`
      );
      //this.$router.push("/search");
      this.isFav = response.data;
    } catch (err) {
      console.log(err.response);
    }
    this.vegan = this.recipe.vegan;
    this.gluten = this.recipe.glutenFree;
  },
};
</script>

<style></style>
