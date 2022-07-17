<template>
  <v-toolbar
    :style="
      !show ? 'background-color:#4caf50' : 'background-color: transparent'
    "
    fixed
  >
    <v-toolbar-title
      class="white--text text-h6"
      style="cursor: pointer"
      @click="homepage()"
      >Kết nối tình nguyện Việt Nam</v-toolbar-title
    >
    <v-spacer></v-spacer>
    <!-- <v-toolbar-items>
      <v-btn
        color="white"
        v-for="item in menu"
        :key="item.icon"
        :to="item.link"
        text
        >{{ item.title }}</v-btn
      >
    </v-toolbar-items> -->
    <v-menu bottom min-width="200px" rounded offset-y v-if="User">
      <template v-slot:activator="{ on }">
        <v-btn icon x-large v-on="on">
          <v-avatar color="white" size="48">
            <img :src="User.avatar_url" alt="avatar" />
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-list-item-content class="justify-center">
          <div class="mx-auto text-center">
            <h3>{{ User.name }}</h3>
            <p class="text-caption mt-1">
              {{ User.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text @click="goToProfile()">
              Trang cá nhân
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn v-if="User.role === 'admin'" text @click="goToAdminPage()"
              >Trang quản trị viên</v-btn
            >
            <v-divider v-if="User.role === 'admin'" class="my-3"></v-divider>

            <v-btn v-if="User.role === 'volunteer'" text @click="goToBookmark()"
              >Đã lưu</v-btn
            >
            <v-divider
              v-if="User.role === 'volunteer'"
              class="my-3"
            ></v-divider>
            <v-btn v-if="User.role === 'organization'" text @click="newPost()"
              >Viết bài</v-btn
            >
            <v-divider
              v-if="User.role === 'organization'"
              class="my-3"
            ></v-divider>
            <v-btn v-if="User.role === 'organization'" text @click="newEvent()"
              >Thêm sự kiện</v-btn
            >
            <v-divider
              v-if="User.role === 'organization'"
              class="my-3"
            ></v-divider>

            <v-btn text @click="logout()">Đăng xuất</v-btn>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>
    <div v-if="!User">
      <v-btn text color="white" @click="login()">Đăng nhập</v-btn>
    </div>
  </v-toolbar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CookiesService from "../../services/cookies.service";
const cookiesService = CookiesService.getService();
export default {
  name: "HeaderPage",
  data() {
    return {};
  },
  props: {
    show: Boolean,
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
  },
  methods: {
    ...mapActions(["logOut"]),
    async logout() {
      try {
        const token = cookiesService.getToken();
        const header = {
          Authorization: "Bearer " + token,
        };
        await this.logOut(header);
        this.$router.push({ path: "/" });
      } catch (error) {
        console.log(error);
      }
    },
    login() {
      this.$router.push({ path: "/login" });
    },
    goToAdminPage() {
      this.$router.push({ path: "/admin" });
    },
    homepage() {
      this.$router.push({ path: "/" }).catch(() => {});
    },
    goToProfile() {
      this.$router.push({ path: "/user/" + this.User.url_account });
      this.$router.go();
    },
    goToBookmark() {
      this.$router.push({ path: "/bookmarked" });
    },
    newPost() {
      this.$router.push({ path: "/add/post" });
    },
    newEvent() {
      this.$router.push({ path: "/add/event" });
    },
  },
};
</script>
<style scoped>
.color-header {
  color: green;
}
.no-color {
  background-color: transparent;
}
</style>
