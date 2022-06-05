<template>
  <v-app>
    <!-- <v-main> -->
    <div id="app">
      <!-- <h1>TEST</h1> -->
      <router-view></router-view>
    </div>
    <!-- </v-main> -->
  </v-app>
</template>

<script>
import CookiesService from "./services/cookies.service";
const cookiesService = CookiesService.getService();
import { mapActions } from "vuex";
import AuthApis from "./factories/auth";

export default {
  name: "App",
  components: {},
  methods: {
    ...mapActions(["getUserProfile"]),
  },

  beforeMount() {
    const token = cookiesService.getToken();
    if (token) {
      AuthApis.getUserProfile()
        .then((response) => {
          this.getUserProfile(response.data.user);
        })
        .catch(() => {
          this.$router.push("/login").catch(() => {});
        });
    } else {
      localStorage.removeItem("user");
      this.$router.push("/login").catch(() => {});
    }
  },
};
</script>

<style>
#app {
  font-family: "Montserrat", Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100vh;
}
</style>
