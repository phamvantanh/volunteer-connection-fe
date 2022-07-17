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
        @change="upload()"
      ></v-file-input>
      <v-text-field
        :rules="titleRule"
        counter
        maxlength="230"
        v-model="title"
        label="Nhập tiêu đề bài viết"
        outlined
      ></v-text-field>
      <vue-editor
        style="min-height: 370px"
        v-model="content"
        use-custom-image-handler
        @image-added="handleImageAdded"
        :editorOptions="editorSettings"
      ></vue-editor>
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
import { VueEditor, Quill } from "vue2-editor";
import axios from "axios";
import ImageResize from "quill-image-resize-vue";
Quill.register("modules/imageResize", ImageResize);

export default {
  components: {
    VueEditor,
  },

  data() {
    return {
      content: "",
      imageUpload: null,
      post_thumbnail: null,
      title: "",
      titleRule: [(v) => !!v || "Hãy nhập mục này *"],
      editorSettings: {
        modules: {
          imageResize: {},
        },
      },
    };
  },

  methods: {
    validForm() {
      return this.$refs.form.validate();
    },
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("image", file);
      axios
        .post("http://127.0.0.1:8000/api/upload", formData)
        .then((response) => {
          this.successAlert("Tải ảnh thành công");
          let url = response.data.link;
          Editor.insertEmbed(cursorLocation, "image", url);
          resetUploader();
        })
        .catch(() => {
          this.errorAlert("Tải ảnh thất bại! thử lại");
        });
    },

    upload() {
      const formData = new FormData();
      formData.append("image", this.post_thumbnail),
        axios
          .post("http://127.0.0.1:8000/api/upload", formData)
          .then((response) => {
            this.successAlert("Tải ảnh thành công");
            this.imageUpload = response.data.link;
          })
          .catch((error) => {
            this.errorAlert("Tải ảnh thất bại! thử lại");
            console.log(error);
          });
    },
    addPost() {
      if (!this.validForm()) {
        return;
      } else {
        const post = {
          title: this.title,
          post_thumbnail: this.imageUpload,
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