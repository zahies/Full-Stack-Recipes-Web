<template>
  <div
    @mousemove="clearTimeoutFunc()"
    class="h"
    :style="{
      'background-image':
        'url(https://nicknguyenportfolio.files.wordpress.com/2011/12/untitled_texture_cxvii_by_aqueous_sun_textures.jpg)',
    }"
  >
    <!-- <img src="../assets/table.jpg" alt="" /> -->
    <h1 class="title" style="padding-left: 190px;">Search Page</h1>
    <br />
    <b-form-input
      class="search"
      v-model="text"
      placeholder="Enter recipe name"
    ></b-form-input>
    <br />
    <br />
    <div class="preference">
      <label for="range-2">
        <b> Number of resluts: {{ numOfRecipes }}</b></label
      >
      <b-form-input
        :style="{
          'background-image': 'url(../assets/muf.png)',
        }"
        id="range-2"
        v-model="numOfRecipes"
        type="range"
        min="5"
        max="15"
        step="5"
      ></b-form-input>
      <br />
      <br />
      <label><b> Diet: </b></label>
      <select v-model="diet" class="choise">
        <option v-for="(diet, index) in diets" :key="index">{{ diet }}</option>
      </select>
      <span style="padding-left:10px">
        <label> <b> Intolerances: </b></label>
        <select v-model="intolerance" class="choise">
          <option v-for="(intolerance, index) in intolerances" :key="index">{{
            intolerance
          }}</option>
        </select>

        <label style="padding-left:10px"> <b> Cusine: </b></label>
        <select v-model="cusine" class="choise">
          <option v-for="(cusine, index) in cusines" :key="index">{{
            cusine
          }}</option>
        </select>
      </span>
      <br />
      <br />
      <label> <b> Sort by: </b></label>
      <div v-if="clicked">
        <select
          class="myselect"
          v-on:change="sortByParam($event, $event.target.selectedIndex)"
        >
          <option></option>
          <option>Likes</option>
          <option>Ready In Minutes</option>
        </select>
      </div>
      <br />
      <br />
      <div>
        <b-button class="search-button" v-on:click="search()" variant="primary"
          >Search</b-button
        >
      </div>
    </div>
    <hr
      style="height:2px;border-width:0;color:gray;background-color:gray;width: 90%"
    />

    <div v-if="this.recipes.length > 0">
      <b-container>
        <b-row>
          <b-col
            v-for="r in sliceRecipes(0, 3)"
            :key="r[0].id"
            class="cont-image"
          >
            <div class="recipe">
              <RecipePreviewFromJson class="recipePreview" :recipe="r[0]" />
            </div>
            <div class="middle">
              <div class="text">Cook Me</div>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            v-for="(r, index) in sliceRecipes(3, 6)"
            :key="index"
            class="cont-image"
          >
            <div class="recipe">
              <RecipePreviewFromJson class="recipePreview" :recipe="r[0]" />
            </div>
            <div class="middle">
              <div class="text">Cook Me</div>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            v-for="(r, index) in sliceRecipes(6, 9)"
            :key="index"
            class="cont-image"
          >
            <div class="recipe">
              <RecipePreviewFromJson class="recipePreview" :recipe="r[0]" />
            </div>
            <div class="middle">
              <div class="text">Cook Me</div>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            v-for="(r, index) in sliceRecipes(9, 12)"
            :key="index"
            class="cont-image"
          >
            <div class="recipe">
              <RecipePreviewFromJson class="recipePreview" :recipe="r[0]" />
            </div>
            <div class="middle">
              <div class="text">Cook Me</div>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            v-for="(r, index) in sliceRecipes(12, 15)"
            :key="index"
            class="cont-image"
          >
            <div class="recipe">
              <RecipePreviewFromJson class="recipePreview" :recipe="r[0]" />
            </div>
            <div class="middle">
              <div class="text">Cook Me</div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div v-else>
      <b-container v-if="clicked">
        Recipe Not Found, try other recipe !
      </b-container>
    </div>
  </div>
</template>

<script>
import RecipePreviewFromJson from "../components/RecipePreviewFromJson";
export default {
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
      index: 0,
      clicked: false,
      numOfRecipes: 5,
      text: "",
      diet: "",
      intolerance: "",
      cusine: "",
      recipes: [],
      recipe: undefined,
      image: "../assets/table.jpg",
      comboDisable: true,
      timeout: undefined,
      cusines: [
        "African",
        "American",
        "British",
        "Cajun",
        "Caribbean",
        "Chinese",
        "European",
        "European",
        "French",
        "German",
        "Greek",
        "Indian",
        "Irish",
        "Italian",
        "Japanese",
        "Jewish",
        "Korean",
        "Latin American",
        "Mediterranean",
        "Mexican",
        "Middle Eastern",
        "Nordic",
        "Southern",
        "Spanish",
        "Thai",
        "Vietnamese",
      ],
      intolerances: [
        "Dairy",
        "Egg",
        "Gluten",
        "Grain",
        "Peanut",
        "Seafood",
        "Sesame",
        "Shellfish",
        "Soy",
        "Sulfite",
        "Tree Nut",
        "Wheat",
      ],
      diets: [
        "Gluten Free",
        "Ketogenic",
        "Vegetarian",
        "Lacto",
        "Vegetarian",
        "Ovo",
        "Vegetarian",
        "Pescetarian",
        "Vegan",
        "Paleo",
        "Primal",
        "Whole30",
      ],
    };
  },
  created() {
    this.recipes = this.$root.store.last_search;
    console.log(this.$root.store.last_search + " asdasd");
    this.$forceUpdate();
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
    async search() {
      let numParsed = parseInt(this.numOfRecipes);
      try {
        const response = await this.axios.get(
          `https://grandma-co-recipes.herokuapp.com/search/query/${this.text}/amount/${numParsed}`,
          {
            params: {
              diet: this.diet,
              cusine: this.cusine,
              intolerances: this.intolerance,
            },
          }
        );
        //this.$router.push("/search");
        const recipes = response.data;
        this.recipes = [];
        this.recipes.push(...recipes);
        console.log(response);
      } catch (err) {
        console.log(err.response);
        this.form.submitError = err.response.data.message;
      }
      this.clicked = true;
      this.comboDisable = false;
      this.$root.store.save_last_search(this.recipes);
    },
    sliceRecipes: function(start, end) {
      return this.recipes.slice(start, end);
    },
    sortByParam(event, selectedIndex) {
      console.log(event, selectedIndex);
      if (this.recipes.length > 0) {
        if (selectedIndex === 1) {
          let maxLikes;
          var i, j;
          for (i = this.recipes.length - 1; i > -1; i--) {
            for (j = i - 1; j > -1; j--) {
              console.log(this.recipes[i].aggregateLikes);
              if (
                this.recipes[i][0].aggregateLikes >
                this.recipes[j][0].aggregateLikes
              ) {
                let temp = this.recipes[j][0];
                this.recipes[j][0] = this.recipes[i][0];
                this.recipes[i][0] = temp;
              }
            }
          }
          this.$forceUpdate();
        } else if (selectedIndex === 2) {
          var i, j;
          for (i = this.recipes.length - 1; i > -1; i--) {
            for (j = i - 1; j > -1; j--) {
              console.log(this.recipes[i].readyInMinutes);
              if (
                this.recipes[i][0].readyInMinutes <
                this.recipes[j][0].readyInMinutes
              ) {
                let temp = this.recipes[j][0];
                this.recipes[j][0] = this.recipes[i][0];
                this.recipes[i][0] = temp;
              }
            }
          }
          this.$forceUpdate();
        }
      }
    },
  },
  computed: {
    isDisabled: function() {
      return this.comboDisable;
    },
  },
};
</script>

<style scoped>
.search {
  font-family: "Noto Sans", sans-serif;
  margin: 0 auto;
  height: 75%;
  width: 75%;
}
.preference {
  font-family: "Noto Sans", sans-serif;
  padding-left: 190px;
  height: 50%;
  width: 60%;
}
.container {
  min-height: 400px;
}
.middle {
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
.cont-image:hover .recipe {
  opacity: 0.4;
}
.cont-image:hover .middle {
  opacity: 1;
}
.cont-image:hover .text {
  opacity: 1;
}
.text {
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  padding: 4px 8px;
}
.cont-image {
  position: relative;
  width: 50%;
}
body {
  background-image: url("../assets/table.jpg");
}
.h {
  background-size: cover;
}
.choise {
  background-color: rgb(189, 214, 218);
}
.myselect {
  background-color: rgb(97, 153, 160);
  mark-color: orange;
}
.search-button {
  width: 120px;
  background-color: rgb(97, 153, 160);
  height: 50%;
}
input[type="range"]::-webkit-slider-thumb {
  background-image: url("https://jackbyblack.tmpurl.co.il/wp-content/uploads/2017/07/43688_jack_burger_320-min.png");
  opacity: 1;
  width: 40px;
  height: 19px;
  position: relative;
  top: 0px;
  z-index: 99;
  color: #4caf50;
  background-color: rgb(97, 153, 160);
}
::-moz-range-thumb {
  background-image: url("https://jackbyblack.tmpurl.co.il/wp-content/uploads/2017/07/43688_jack_burger_320-min.png");
  width: 40px;
  height: 19px;
  color: #4caf50;
  background-color: rgb(97, 153, 160);
}
::-ms-thumb {
  background-image: url("https://jackbyblack.tmpurl.co.il/wp-content/uploads/2017/07/43688_jack_burger_320-min.png");
  width: 40px;
  height: 19px;
  z-index: 9999;
  display: block;
  background-color: transparent;
  color: #4caf50;
  background-color: rgb(97, 153, 160);
}
</style>