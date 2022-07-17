<template>
  <div>
    <header-page></header-page>
    <v-main class=" mb-5" style="min-height: 625px">
      <router-view></router-view>
    </v-main>

    <footer-page></footer-page>
  </div>
</template>

<script>
import HeaderPage from "./Header.vue";
import FooterPage from "./Footer.vue";
export default {
  components: { HeaderPage, FooterPage },
};
</script>

<style>
</style>