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
      id: null,
      content: "",
      imageUpload: null,
      post_thumbnail: null,
      post_thumbnailBefore: null,
      title: "",
      slug: "",
      titleRule: [(v) => !!v || "Hãy nhập mục này *"],
      editorSettings: {
        modules: {
          imageResize: {},
        },
      },
    };
  },
  created() {
    this.getPostDetail(this.$route.params.slug);
  },

  methods: {
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("image", file);
      this.showLoadingOverlay();
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
      this.hideLoadingOverlay();
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
    getPostDetail(slug) {
      this.showLoadingOverlay();
      PostApis.getPostDetail(slug)
        .then((value) => {
          this.id = value.id;
          this.content = value.content;
          this.title = value.title;
          this.post_thumbnail = value.post_thumbnail;
          this.post_thumbnailBefore = value.post_thumbnail;
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
          content: this.content,
          post_thumbnail: this.imageUpload
            ? this.imageUpload
            : this.post_thumbnailBefore,
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