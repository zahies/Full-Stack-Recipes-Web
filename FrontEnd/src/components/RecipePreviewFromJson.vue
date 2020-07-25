<template>
  <router-link
    :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
    class="recipe-preview"
  >
    <div class="container">
      <div class="recipe-body">
        <img :src="recipe.image" class="recipe-image" />
      </div>
      <div class="recipe-footer">
        <div :title="recipe.title" class="recipe-title">
          <b>{{ recipe.title }}</b>
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
    </div>
  </router-link>
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

<style>
.recipe-image {
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  display: block;
  width: 98%;
  height: auto;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
}
.recipe-footer {
  font-family: Arial, Helvetica, sans-serif;
  color: black;
}
.recipe-overview {
  color: rgb(52, 113, 121);
}
.container {
  border-block-color: black;
  border: 1px;
  border-style: outset;
}
</style>
