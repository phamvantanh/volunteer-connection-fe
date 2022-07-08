<template>
  <v-container fluid>
    <h1>Kết quả tìm kiếm bài viết với từ khóa "{{ this.keyword }}"</h1>
    <v-row dense>
      <v-col v-for="post in posts" :key="post.id" cols="6">
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
                <div v-if="User" class="pt-4">
                  <v-btn
                    v-if="User.role === 'volunteer'"
                    icon
                    :color="post.bookmark ? 'green' : ''"
                    @click.stop="
                      post.bookmark
                        ? unBookmarkPost(post.id)
                        : bookmarkPost(post.id)
                    "
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
</template>

<script>
import { mapGetters } from "vuex";
import PostApis from "@/factories/post";
import HomeApis from "@/factories/home";
export default {
  data: () => ({
    keyword: "",
    posts: [],
  }),
  computed: {
    ...mapGetters({ User: "StateUser" }),
  },
  created() {
    this.keyword = this.$route.params.keyword;
    PostApis.getPostSearch(this.keyword)
      .then((value) => {
        this.posts = value;
      })
      .catch(() => {});
  },
  methods: {
    viewPost(slug) {
      return this.$router.push({ path: "/post/" + slug });
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
  },
};
</script>

<style>
</style>