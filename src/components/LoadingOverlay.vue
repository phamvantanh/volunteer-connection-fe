<template>
  <div class="loading-overlay-container">
    <v-overlay :value="loadingOverlayVisible">
      <v-progress-circular
        indeterminate
        size="64"
        color="red"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
  name: "loading-overlay",
  props: {
    loadingOverlayVisible: Boolean,
  },
};
</script>

<style scoped>
.loading-overlay-container {
  z-index: 999;
}
</style>
