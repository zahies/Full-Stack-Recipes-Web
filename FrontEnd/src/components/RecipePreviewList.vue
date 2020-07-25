<template>
  <b-container>
    <h3>
      {{ title }}:
      <slot></slot>
    </h3>
    <b-col>
      <b-row v-for="r in recipes" :key="r.id">
        <RecipePreviewFromJson class="recipePreview" :recipe="r" />
      </b-row>
    </b-col>
    <strong>Click To Re-Random : </strong>
    <img src="../assets/dice.png" v-on:click="updateRecipes()" />
  </b-container>
</template>

<script>
import RecipePreviewFromJson from "./RecipePreviewFromJson.vue";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreviewFromJson,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      recipes: [],
    };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      try {
        const response = await this.axios.get(
          "http://localhost:4000/recipes/randomRecipes"
        );
        console.log(response);
        const recipes = response.data;
        this.recipes = [];
        this.recipes.push(...recipes);
        // console.log(this.recipes);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
</style>
