<template>
  <b-container>
        <h3>
            {{ title }}:
            <slot></slot>
        </h3>
    <b-col>
      <b-row v-for="r in this.recipes" :key="r.id">
        <DBRecipesPreview class="recipePreview" :recipe="r" />
      </b-row>
    </b-col>
  </b-container>
</template>

<script>
import DBRecipesPreview from "./DBRecipesPreview"
export default {
  name: "MyRecipesList",
  components: {
    DBRecipesPreview
  },
  props: {
    title: {
      type: String,
      required: true
    },
    recipes:{
        type : Array,
        required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
</style>
