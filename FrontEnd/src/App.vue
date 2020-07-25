<template>
  <div id="app" :style="{
      'background-image':
        'url(https://serving.photos.photobox.com/26138138ac3ccdbc9ffbaccd55a73b30a4a0d88a00c5b264b39d7c637119988ffda76d14.jpg)',
        'background-size': 'cover'
    }">
    <div id="nav" :style="{
      'background-color':
        'rgba(128,128,128,0.8)',
    }">
      <router-link :to="{ name: 'main' }"><img src="../src/assets/home_button.png"/></router-link> |
      <router-link :to="{ name: 'search' }">Search</router-link> |
      <!--{{ !$root.store.username }}-->
      <span v-if="!$root.store.username">
        Hi Guest:
        <router-link :to="{ name: 'register' }">Register</router-link>|
        <router-link :to="{ name: 'login' }">Login</router-link>|
      </span>
      <span v-else>
        Hi {{ $root.store.username }}:
        <b-dropdown id="dropdown-1" text="Personal Zone" style="color : black">
          <b-dropdown-item
            ><router-link :to="{ name: 'favoriteRecipes' }"
              >Favorite Recipes</router-link
            ></b-dropdown-item
          >
          <b-dropdown-item
            ><router-link :to="{ name: 'myRecipes' }"
              >My Recipes</router-link
            ></b-dropdown-item
          >
          <b-dropdown-item
            ><router-link :to="{ name: 'familyRecipes' }"
              >Family Recipes</router-link
            ></b-dropdown-item
          >
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item
            ><button @click="Logout">Logout</button></b-dropdown-item
          >
        </b-dropdown>
      </span>
      <span style="float:right">
        <router-link :to="{ name: 'about' }"><img src="../src/assets/about.png"/></router-link>
      </span>
    </div>
    <router-view @mousemove="clearTimeoutFunc(this.timeout)"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {},
  methods: {
    Logout() {
      sessionStorage.clear();
      this.$root.store.logout();
      this.$root.toast("Logout", "User logged out successfully", "success");

      this.$router.push("/").catch(() => {
        this.$forceUpdate();
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/scss/form-style.scss";

.h {
  background-size: cover;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color:black;
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color:black;

}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
