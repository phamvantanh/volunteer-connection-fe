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
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>

    <v-menu
      bottom
      min-width="300px"
      max-width="300px"
      max-height="400px"
      rounded
      offset-y
      v-if="User"
    >
      <template v-slot:activator="{ on }">
        <!-- <v-btn icon x-large v-on="on" color="white">
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn> -->
        <v-badge
          :content="numberNotRead"
          :value="numberNotRead"
          color="red"
          overlap
        >
          <v-icon v-on="on" large color="white">mdi-bell-outline</v-icon>
        </v-badge>
      </template>
      <v-card class="mx-auto">
        <v-list-item-content class="justify-center">
          <div v-if="notiList.length === 0">Không có thông báo</div>
          <div
            style="cursor: pointer"
            v-for="notification in notiList"
            :key="notification.id"
            @click="viewEvent(notification)"
          >
            <div class="mb-2">{{ notification.created_at }}</div>
            <div class="mb-2 green--text">
              {{ notification.is_seen ? "Đã đọc" : "Chưa đọc" }}
            </div>

            <div
              class="mt-0 rounded-lg"
              :style="!notification.is_seen ? 'font-weight: bold;' : ''"
            >
              {{ notification.content }}
            </div>
            <v-divider class="my-3"></v-divider>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>
    <v-spacer></v-spacer>
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
import UserApis from "@/factories/user";
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
    notiList() {
      if (this.User && this.User.notification) {
        const list = this.cloneDeep(this.User.notification).sort(function (
          a,
          b
        ) {
          return a.is_seen - b.is_seen;
        });
        return list;
      } else return [];
    },
    numberNotRead() {
      if (this.User && this.User.notification) {
        const $arrayList = this.User.notification.filter(
          (noti) => noti.is_seen === 0
        );
        return $arrayList.length;
      } else return 0;
    },
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
        this.$router.push({ path: "/" }).catch(() => {});
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
    viewEvent(notification) {
      UserApis.readNotice(notification.id)
        .then(() => {
          this.$router.push({ path: "/event/" + notification.event.slug });
          this.$router.go();
        })
        .catch(() => {
          this.$router.push({ path: "/event/" + notification.event.slug });
        });
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
