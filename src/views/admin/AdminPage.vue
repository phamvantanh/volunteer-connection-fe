<template>
  <v-app>
    <Navigation :pathh="this.$router.currentRoute.path" />
    <v-main class="ml-5 mr-5">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from "./Navigation.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      //   cookie: cookiesService.getToken(),
    };
  },
  components: {
    Navigation,
  },
  // mounted: function () {
  //   console.log(this.User.role);
  //   if (this.User.role === "admin") {
  //     return;
  //   } else {
  //     this.$router.push({ path: "/" });
  //   }
  // },

  computed: {
    ...mapGetters({ User: "StateUser" }),
  },
};
</script>

<style scoped>
</style>
