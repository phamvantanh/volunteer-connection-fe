<template>
  <div class="ma-16 pa-10 pt-0">
    <h5 class="mt-5 text-h4 blue--text text-center">THÊM SỰ KIỆN MỚI</h5>
    <v-form ref="form">
      <v-file-input
        v-model="event.event_thumbnail"
        accept="image/png, image/jpeg, image/bmp"
        placeholder="Tải lên ảnh minh họa của sự kiện"
        prepend-icon="mdi-camera"
        label="Ảnh minh họa"
      ></v-file-input>
      <v-text-field
        :rules="titleRule"
        counter
        maxlength="230"
        v-model="event.title"
        label="Nhập tiêu đề sự kiện"
        outlined
      ></v-text-field>
      <v-row class="ml-1 mr-1 mt-3 mb-5">
        <v-select
          v-model="event.category_id"
          :rules="titleRule"
          :items="category"
          item-text="name"
          item-value="id"
          outlined
          label="Thể loại sự kiện"
          color="green"
        ></v-select>
        <v-spacer></v-spacer>
        <v-text-field
          type="date"
          :rules="titleRule"
          v-model="event.deadline"
          label="Deadline"
          :min="nowDate"
          outlined
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-select
          :items="statusItems"
          :rules="statusRule"
          v-model="event.status"
          outlined
          label="Trạng thái sự kiện"
          color="green"
        ></v-select>
        <v-spacer></v-spacer>
        <v-select
          :items="showItems"
          :rules="statusRule"
          v-model="event.is_published"
          outlined
          label="Trạng thái hiển thị"
          color="green"
        ></v-select>
      </v-row>
      <vue-editor
        style="min-height: 370px"
        v-model="event.content"
      ></vue-editor>
      <v-btn
        color="green"
        class="white--text mt-5"
        style="margin-left: 45%"
        @click="editEvent()"
        >LƯU CHỈNH SỬA</v-btn
      >
    </v-form>
  </div>
</template>


<script>
import { VueEditor } from "vue2-editor";
import EventApis from "@/factories/event";

export default {
  components: {
    VueEditor,
  },

  data() {
    return {
      titleRule: [(v) => !!v || "Hãy nhập mục này *"],
      statusRule: [(v) => v !== null || "Hãy nhập mục này *"],
      event: {
        id: null,
        title: null,
        content: null,
        category_id: null,
        event_thumbnail: null,
        deadline: null,
        status: null,
        is_published: null,
      },
      category: [],
      statusItems: [
        { text: "Mở", value: 1 },
        { text: "Đóng", value: 0 },
      ],
      showItems: [
        { text: "Công khai", value: 1 },
        { text: "Chỉ mình tôi", value: 0 },
      ],
    };
  },
  computed: {
    nowDate() {
      return new Date().toJSON().slice(0, 10).replace(/-/g, "-");
    },
  },
  created() {
    EventApis.getCategory()
      .then((value) => {
        this.category = value;
      })
      .catch(() => {});
    this.getEventDetail(this.$route.params.slug);
  },
  methods: {
    getEventDetail(slug) {
      this.showLoadingOverlay();
      EventApis.getEventDetail(slug)
        .then((value) => {
          this.event = value;
          this.event.deadline = value.deadline.slice(0, 10);
        })
        .catch(() => {});
      this.hideLoadingOverlay();
    },
    validForm() {
      console.log(this.event.status);
      return this.$refs.form.validate();
    },
    editEvent() {
      if (!this.validForm()) {
        return;
      } else if (this.event.content === null) {
        console.log(this.event.content);
        this.errorAlert("Nhập nội dung sự kiện.");
      } else {
        // this.event.event_thumbnail =
        //   "https://blog.topcv.vn/wp-content/uploads/2019/02/nhan-vien-to-chuc-su-kien.jpg";
        EventApis.editEvent(this.event)
          .then((value) => {
            this.successAlert("Chỉnh sửa sự kiện thành công");
            this.$router.push({ path: "/event/" + value.slug });
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