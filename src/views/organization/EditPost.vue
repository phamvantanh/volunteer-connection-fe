<template>
  <div class="ma-10">
    <h5 class="mt-5 text-h4 blue--text text-center">VIẾT BÀI</h5>
    <v-form ref="form">
      <v-file-input
        v-model="post_thumbnail"
        accept="image/png, image/jpeg, image/bmp"
        placeholder="Tải lên ảnh minh họa của bài viết"
        prepend-icon="mdi-camera"
        label="Ảnh minh họa"
      ></v-file-input>
      <v-text-field
        :rules="titleRule"
        counter
        maxlength="230"
        v-model="title"
        label="Nhập tiêu đề bài viết"
        outlined
      ></v-text-field>
      <vue-editor style="min-height: 370px" v-model="content"></vue-editor>
      <v-row class="mt-5">
        <v-spacer></v-spacer>
        <v-btn color="primary" class="white--text mr-5" @click="cancel()"
          >HỦY</v-btn
        >
        <v-btn color="green" class="white--text" @click="editPost()"
          >LƯU CHỈNH SỬA</v-btn
        >
        <v-spacer></v-spacer>
      </v-row>
    </v-form>
  </div>
</template>


<script>
import PostApis from "@/factories/post";
import { VueEditor } from "vue2-editor";

export default {
  components: {
    VueEditor,
  },

  data() {
    return {
      id: null,
      content: "",
      post_thumbnail: "",
      title: "",
      slug: "",
      titleRule: [(v) => !!v || "Hãy nhập mục này *"],
    };
  },
  created() {
    this.getPostDetail(this.$route.params.slug);
  },

  methods: {
    getPostDetail(slug) {
      this.showLoadingOverlay();
      PostApis.getPostDetail(slug)
        .then((value) => {
          this.id = value.id;
          this.content = value.content;
          this.title = value.title;
          this.post_thumbnail = value.post_thumbnail;
          this.slug = value.slug;
        })
        .catch(() => {});
      this.hideLoadingOverlay();
    },
    validForm() {
      return this.$refs.form.validate();
    },
    cancel() {
      this.$router.push({ path: "/post/" + this.slug });
    },
    editPost() {
      if (!this.validForm()) {
        return;
      } else {
        const post = {
          id: this.id,
          title: this.title,
          post_thumbnail: this.post_thumbnail,
          // "https://images.hcmcpv.org.vn/res/news/2021/10/04-10-2021-nhung-tinh-nguyen-vien-gop-suc-vao-cuoc-chien-chong-covid19-tai-quan-binh-tan-641656A9-details.jpg?vs=04102021100359",
          content: this.content,
        };
        PostApis.editPost(post)
          .then((value) => {
            this.successAlert("Chỉnh sửa thành công");
            this.$router.push({ path: "/post/" + value.slug });
          })
          .catch((error) => {
            if (error.response.status === 403) {
              this.errorAlert("Bạn không phải chủ bài viết!");
            } else {
              this.errorAlert("Đã xảy ra lỗi! Thử lại sau");
            }
          });
      }
    },
  },
};
</script>

<style>
</style>