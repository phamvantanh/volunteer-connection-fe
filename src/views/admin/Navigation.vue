<template>
  <v-navigation-drawer
    permanent
    expand-on-hover
    app
    width="15%"
    v-model="drawer"
    color="black"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h5 white--text">
          TÌNH NGUYỆN
        </v-list-item-title>
        <v-list-item-subtitle class="white--text">
          Trang quản lý</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list dense nav>
      <v-list-item
        dark
        v-for="item in items"
        :key="item.title"
        v-bind:style="color(item)"
        :to="item.href"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "NavigationBar",
  props: {
    pathh: String,
  },
  data: () => ({
    drawer: true,
    items: [
      {
        title: "Thống kê",
        icon: "mdi-view-dashboard",
        href: "/admin/dashboard",
      },
      {
        title: "Người dùng",
        icon: "mdi-account",
        href: "/admin/users",
      },
      {
        title: "Bài viết",
        icon: "mdi-post",
        href: "/admin/posts",
      },
      {
        title: "Thể loại sự kiện",
        icon: "mdi-folder-multiple",
        href: "/admin/category",
      },
      {
        title: "Sự kiện",
        icon: "mdi-calendar-check",
        href: "/admin/events",
      },
      {
        title: "Báo cáo",
        icon: "mdi-file-document",
        href: "/admin/reports",
      },
      {
        title: "Về trang chủ",
        icon: "mdi-home",
        href: "/",
      },
    ],
  }),
  methods: {
    color(item) {
      if (this.cloneDeep(this.pathh) === item.href) {
        return "background-color: #4caf50 !important;";
      } else return "background-color: black";
    },
  },
};
</script>
<style scoped>
.theme--dark.v-list-item--active:before,
.theme--dark.v-list-item--active:hover:before,
.theme--dark.v-list-item:focus:before {
  opacity: 0;
}
</style>