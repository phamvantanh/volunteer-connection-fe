<template>
  <v-content class="mt-n16">
    <div class="container-search">
      <header-page :show="true"></header-page>
      <v-row style="height: 410px" justify="center" class="mb-3 mt-5">
        <h1 class="mt-16 ml-16 white--text text-center" style="font-size: 4em">
          HÃY LÀM NHỮNG VIỆC BÌNH THƯỜNG
        </h1>
        <h1
          class="ml-5 mb-16 white--text text-center mt-n16"
          style="font-size: 4em"
        >
          BẰNG LÒNG SAY MÊ PHI THƯỜNG
        </h1>
      </v-row>
      <v-row justify="center" class="mt-5 white--text">
        <v-col cols="12" sm="3" class="pa-0 pr-1">
          <v-text-field
            label="Nhập từ khóa tìm kiếm"
            single-line
            outlined
            color="green"
            v-model="keyword"
            style="background-color: white; height: 56px"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="2" class="pa-0">
          <v-select
            :items="searchItems"
            item-text="text"
            item-value="value"
            v-model="defaultSelected"
            outlined
            color="green"
            style="background-color: white; height: 56px"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="1" justify="start" class="pa-0">
          <v-btn class="mx-1" fab color="green" @click="search()">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- <v-divider class="mt-16"></v-divider> -->
    <v-card color="#C8E6C9">
      <h5 class="mt-5 text-h3 blue--text text-center">HOẠT ĐỘNG TÌNH NGUYỆN</h5>
      <p class="text-center text-h6 mt-3">
        Chia sẻ thông tin về hoạt động tình nguyện đã tổ chức, các tấm gương
        tình nguyện viên tiêu biểu; các mô hình hoạt động tình nguyện hiệu quả
      </p>
      <v-container fluid>
        <v-row dense>
          <v-col v-for="post in posts" :key="post.id" :cols="colNumber">
            <v-card
              height="300px"
              class="mt-5 rounded-xl mb-5 mx-auto"
              @click="viewPost(post.slug)"
              max-width="95%"
            >
              <v-row>
                <v-col cols="12" sm="4" class="ml-0 pl-3 pt-3 pl-0">
                  <v-img
                    :src="post.post_thumbnail"
                    class="white--text align-end rounded-xl"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="280px"
                  >
                  </v-img>
                </v-col>
                <v-col cols="12" sm="8">
                  <v-row>
                    <v-col cols="12" sm="11" class="pr-0">
                      <v-card-subtitle
                        class="text-h5 green--text pb-2 pl-2 mt-4 pr-0"
                        width="50%"
                        v-text="truncate100(post.title)"
                      ></v-card-subtitle>
                    </v-col>
                    <!-- <v-spacer></v-spacer> -->
                    <!-- <div v-if="User" class="pt-4" max-width="5px"> -->
                    <v-btn
                      v-if="User && User.role === 'volunteer'"
                      icon
                      class="pa-0 pt-10 pr-5"
                      :color="post.bookmark ? 'green' : ''"
                      @click.stop="
                        post.bookmark
                          ? unBookmarkPost(post.id)
                          : bookmarkPost(post.id)
                      "
                    >
                      <v-icon>mdi-bookmark</v-icon>
                    </v-btn>
                  </v-row>
                  <v-row>
                    <p
                      style="
                        text-align: justify;
                        text-justify: inter-word;
                        padding-left: 20px;
                        padding-right: 20px;
                        margin-bottom: 0px;
                        font-size: 16px;
                        font-weight: normal;
                      "
                      v-html="truncate220(post.content)"
                    ></p>
                  </v-row>
                  <v-row>
                    <v-card-subtitle class="pb-0 pt-0"
                      >Người đăng:
                      <v-btn
                        text
                        style="text-transform: none"
                        color="green"
                        class="pb-0"
                        @click.stop="viewUser(post.user.url_account)"
                        >{{ post.user.name }}</v-btn
                      ></v-card-subtitle
                    >
                    <v-card-subtitle class="pb-2 pt-1"
                      >Chỉnh sửa lần cuối lúc:
                      {{ post.updated_at.substring(0, 10) }}</v-card-subtitle
                    >
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!-- </v-card> -->
      <div class="text-center">
        <v-pagination
          v-model="currentPage"
          :length="maxPageOfPosts"
          circle
          @input="getPosts()"
        ></v-pagination>
      </div>
    </v-card>
    <v-divider></v-divider>
    <v-card color="white " class="mt-5">
      <h5 class="mt-5 text-h3 blue--text text-center">SỰ KIỆN TÌNH NGUYỆN</h5>
      <p class="text-center text-h6">
        Chia sẻ các sự kiện được các tổ chức tình nguyện đăng tải
      </p>
      <!-- <v-card class="mt-5"> -->
      <v-container fluid>
        <v-row dense>
          <v-col v-for="event in events" :key="event.id" :cols="eventCol">
            <v-card @click="viewEvent(event.slug)" height="450px" class="mb-5">
              <v-img
                :src="event.event_thumbnail"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
              </v-img>
              <v-row class="mt-1">
                <v-col cols="12" sm="11" class="pa-0">
                  <v-card-subtitle
                    class="text-h6 green--text pb-2 pr-0"
                    width="50%"
                    v-text="smallTitle ? event.title : event.title"
                  ></v-card-subtitle>
                </v-col>
                <v-col cols="12" sm="1" class="pa-0">
                  <div v-if="User" class="mr-4 mt-4">
                    <v-btn
                      v-if="User.role === 'volunteer'"
                      icon
                      :color="event.bookmark ? 'green' : ''"
                      @click.stop="
                        event.bookmark
                          ? unBookmarkEvent(event.id)
                          : bookmarkEvent(event.id)
                      "
                    >
                      <v-icon>mdi-bookmark</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-chip class="ml-4 mb-2" color="primary">
                  Thể loại: {{ event.category.name }}
                </v-chip>
              </v-row>
              <v-row>
                <v-chip class="ml-4" color="red" text-color="white">
                  Deadline : {{ event.deadline.substring(0, 10) }}
                </v-chip>
                <v-chip
                  class="ml-4"
                  :color="event.status ? 'green' : 'close'"
                  text-color="white"
                >
                  Trạng thái: {{ event.status ? "Mở" : "Đóng" }}
                </v-chip>
              </v-row>
              <v-row class="pt-1">
                <v-card-subtitle class="pb-0 pt-0"
                  >Người đăng:
                  <v-btn
                    text
                    style="text-transform: none"
                    color="green"
                    class="pb-0"
                    @click.stop="viewUser(event.user.url_account)"
                    >{{ event.user.name }}</v-btn
                  ></v-card-subtitle
                >
                <v-card-subtitle class="pb-2 pt-1"
                  >Chỉnh sửa lần cuối lúc:
                  {{
                    event.updated_at ? event.updated_at.substring(0, 10) : ""
                  }}
                </v-card-subtitle>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!-- </v-card> -->
      <div class="text-center">
        <v-pagination
          v-model="currentEventPage"
          :length="maxPageOfEvents"
          circle
          @input="getEvents()"
        ></v-pagination>
      </div>
    </v-card>
  </v-content>
</template>

<script>
import { mapGetters } from "vuex";
import HomeApis from "../../factories/home";
import HeaderPage from "./Header.vue";

export default {
  components: { HeaderPage },
  name: "WelcomePage",
  data: () => ({
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80",
    keyword: "",
    colNumber: 6,
    posts: [],
    events: [],
    currentPage: 1,
    currentEventPage: 1,
    maxPageOfEvents: 1,
    eventCol: 4,
    smallTitle: false,
    maxPageOfPosts: 1,
    hideContent: false,
    searchItems: [
      { text: "Hoạt động tình nguyện", value: "post" },
      { text: "Sự kiện tình nguyện", value: "event" },
    ],
    defaultSelected: "post",
  }),
  computed: {
    ...mapGetters({ User: "StateUser" }),
  },
  created() {
    this.showLoadingOverlay();
    this.getPosts();
    this.getEvents();
    this.hideLoadingOverlay();
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  methods: {
    getPosts() {
      HomeApis.getPosts(this.currentPage)
        .then((value) => {
          this.posts = value.data;
          this.maxPageOfPosts = value.last_page;
          this.currentPage = value.current_page;
        })
        .catch(() => {});
    },
    getEvents() {
      HomeApis.getEvents(this.currentEventPage)
        .then((value) => {
          this.events = value.data;
          this.maxPageOfEvents = value.last_page;
          this.currentEventPage = value.current_page;
        })
        .catch(() => {});
    },
    viewPost(slug) {
      return this.$router.push({ path: "/post/" + slug });
    },
    viewEvent(slug) {
      return this.$router.push({ path: "/event/" + slug });
    },
    viewUser(url) {
      return this.$router.push({ path: "/user/" + url });
    },
    unBookmarkPost(id) {
      HomeApis.unBookmarkPost(id)
        .then(() => {
          this.successAlert("Hủy lưu thành công");
          const found = this.posts.findIndex((post) => post.id === id);
          this.posts[found].bookmark = false;
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
    },
    bookmarkPost(id) {
      HomeApis.bookmarkPost(id)
        .then(() => {
          this.successAlert("Lưu thành công");
          const found = this.posts.findIndex((post) => post.id === id);
          this.posts[found].bookmark = true;
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
    },
    unBookmarkEvent(id) {
      HomeApis.unBookmarkEvent(id)
        .then(() => {
          this.successAlert("Hủy lưu thành công");
          const found = this.events.findIndex((event) => event.id === id);
          this.events[found].bookmark = false;
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
    },
    bookmarkEvent(id) {
      HomeApis.bookmarkEvent(id)
        .then(() => {
          this.successAlert("Lưu thành công");
          const found = this.events.findIndex((event) => event.id === id);
          this.events[found].bookmark = true;
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
    },
    search() {
      if (this.keyword === "") {
        this.errorAlert("Nhập nội dung tìm kiếm!");
        return;
      }
      if (this.defaultSelected === "post") {
        console.log(this.keyword);
        this.$router.push({
          path: "/posts/search",
          name: "PostSearch",
          params: { keyword: this.keyword },
        });
      } else {
        this.$router.push({
          path: "/events/search",
          name: "EventSearch",
          params: { keyword: this.keyword },
        });
      }
    },
    onResize() {
      if (window.innerWidth < 1450) {
        this.colNumber = 12;
        this.eventCol = 6;
      } else {
        this.colNumber = 6;
        this.eventCol = 4;
      }
      if (window.innerWidth < 950) {
        this.smallTitle = true;
      } else {
        this.smallTitle = false;
      }
    },
  },
};
</script>

<style scoped>
.container-search {
  height: 750px;
  background: url("https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80")
    no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
h1 {
  text-shadow: 1px 3px black, 0 0 50px green, 0 0 100px darkblue;
}
</style>
