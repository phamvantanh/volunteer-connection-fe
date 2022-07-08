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
      <v-btn
        color="green"
        class="white--text"
        style="margin-left: 45%"
        @click="addPost()"
        >ĐĂNG BÀI</v-btn
      >
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
      content: "",
      post_thumbnail: "",
      title: "",
      titleRule: [(v) => !!v || "Hãy nhập mục này *"],
    };
  },

  methods: {
    validForm() {
      return this.$refs.form.validate();
    },
    addPost() {
      if (!this.validForm()) {
        return;
      } else {
        const post = {
          title: this.title,
          post_thumbnail: null,
          // "https://images.hcmcpv.org.vn/res/news/2021/10/04-10-2021-nhung-tinh-nguyen-vien-gop-suc-vao-cuoc-chien-chong-covid19-tai-quan-binh-tan-641656A9-details.jpg?vs=04102021100359",
          content: this.content,
        };
        PostApis.addPost(post)
          .then((value) => {
            this.successAlert("Đăng bài viết thành công");
            this.$router.push({ path: "/post/" + value.slug });
          })
          .catch((error) => {
            if (error.response.status === 403) {
              this.errorAlert(
                "Chức năng này chỉ dành cho tổ chức tình nguyện!"
              );
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