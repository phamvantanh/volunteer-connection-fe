<template>
  <v-content>
    <v-card color="white ">
      <h5 class="mt-5 text-h4 blue--text text-center">BÀI VIẾT ĐÃ LƯU</h5>
      <v-container fluid>
        <v-row dense>
          <v-col v-for="post in posts" :key="post.id" :cols="colNumber">
            <v-card height="300px" class="mt-5" @click="viewPost(post.slug)">
              <v-row>
                <v-col cols="12" sm="4" class="ml-0 pl-3 pt-3 pl-0">
                  <v-img
                    :src="post.post_thumbnail"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="280px"
                  >
                  </v-img>
                </v-col>
                <v-col cols="12" sm="8">
                  <v-row>
                    <v-col cols="12" sm="11">
                      <v-card-subtitle
                        class="text-h6 green--text pb-2 pl-2"
                        width="50%"
                        v-text="post.title"
                      ></v-card-subtitle>
                    </v-col>
                    <!-- <v-spacer></v-spacer> -->
                    <div v-if="User" class="pt-4">
                      <v-btn
                        v-if="User.role === 'volunteer'"
                        icon
                        color="green"
                        @click.stop="unBookmarkPost(post.id)"
                      >
                        <v-icon>mdi-bookmark</v-icon>
                      </v-btn>
                    </div>
                  </v-row>
                  <v-row>
                    <p
                      style="
                        text-align: justify;
                        text-justify: inter-word;
                        padding-left: 20px;
                        padding-right: 20px;
                        margin-bottom: 0px;
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
      <!-- <div class="text-center">
        <v-pagination
          v-model="currentPage"
          :length="maxPageOfPosts"
          circle
          @input="getPosts()"
        ></v-pagination>
      </div> -->
    </v-card>
    <v-divider></v-divider>
    <v-card color="white " class="mt-5">
      <h5 class="mt-5 text-h4 blue--text text-center">SỰ KIỆN ĐÃ LƯU</h5>
      <v-container fluid>
        <v-row dense>
          <v-col v-for="event in events" :key="event.id" :cols="eventCol">
            <v-card @click="viewEvent(event.slug)" height="500px">
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
                      color="green"
                      @click.stop="unBookmarkEvent(event.id)"
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
      <!-- <div class="text-center">
        <v-pagination
          v-model="currentEventPage"
          :length="maxPageOfEvents"
          circle
        ></v-pagination>
      </div> -->
    </v-card>
  </v-content>
</template>

<script>
import { mapGetters } from "vuex";
import HomeApis from "../../factories/home";

export default {
  name: "WelcomePage",
  data: () => ({
    colNumber: 6,
    posts: [],
    events: [],
    // currentPage: 1,
    // currentEventPage: 1,
    // maxPageOfEvents: 1,
    eventCol: 4,
    smallTitle: false,
    // maxPageOfPosts: 1,
    hideContent: false,
    searchItems: [
      { text: "Hoạt động tình nguyện", value: "post" },
      { text: "Sự kiện tình nguyện", value: "event" },
    ],
    defaultSelected: {
      text: "Hoạt động tình nguyện",
      value: "post",
    },
  }),
  computed: {
    ...mapGetters({ User: "StateUser" }),
  },
  created() {
    this.getPosts();
    this.getEvents();
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  methods: {
    getPosts() {
      HomeApis.getPostsBookmarked()
        .then((value) => {
          this.posts = value.map(({ post }) => post);
          console.log(this.posts);
          //   this.maxPageOfPosts = value.last_page;
          //   this.currentPage = value.current_page;
        })
        .catch(() => {});
    },
    getEvents() {
      HomeApis.getEventsBookmarked()
        .then((value) => {
          this.events = value.map(({ event }) => event);

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
          this.posts.splice(found, 1);
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
          this.events.splice(found, 1);
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
      // if (window.innerWidth < 800) {
      //   this.hideContent = true;
      // } else {
      //   this.hideContent = false;
      // }
    },
  },
};
</script>

<style scoped>
</style>
