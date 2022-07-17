<template>
  <div id="app">
    <vue-editor
      use-custom-image-handler
      @image-added="handleImageAdded"
      :editorOptions="editorSettings"
      v-model="content"
    ></vue-editor>
    <p>{{ content }}</p>
  </div>
</template>

<script>
import { VueEditor, Quill } from "vue2-editor";
import axios from "axios";
import ImageResize from "quill-image-resize-vue";
Quill.register("modules/imageResize", ImageResize);

export default {
  name: "TestUpload",
  components: {
    VueEditor,
  },
  props: ["data", "lang", "dataItem"],
  data() {
    return {
      htmlForEditor: "",
      editorSettings: {
        modules: {
          imageResize: {},
        },
      },
      content: "",
    };
  },

  methods: {
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
  },
};
</script>