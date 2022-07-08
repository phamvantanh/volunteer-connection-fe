<!-- eslint-disable -->
<template>
  <v-data-table
    :headers="headers"
    :items="posts"
    :search="search"
    sort-by="created_at"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>QUẢN LÝ BÀI VIẾT</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialogDelete" max-width="400px">
          <v-card>
            <v-card-title class="text-h8 red--text"
              >Bạn chắc chắn muốn xóa bài viết này?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Hủy</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Xóa</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <!-- <template v-slot:[`item.thumbnail`]="{ item }">
      <img :src="item.thumbnail" style="width: 50px; height: 50px" />
    </template> -->
    <template v-slot:[`item.id`]="{ index }">
      <div>{{ index + 1 }}</div>
    </template>
    <template v-slot:[`item.content`]="{ item }">
      <div v-html="truncate220(item.content)"></div>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      <v-icon small @click="viewPost(item)"> mdi-link-variant </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchAllPosts()"> Làm mới </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import AdminApis from "../../factories/admin";

export default {
  data: () => ({
    search: "",
    dialogDelete: false,
    editedItem: "",
    headers: [
      {
        text: "STT",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Tiêu đề", value: "title" },
      { text: "Đường dẫn", value: "slug" },
      { text: "Chủ bài viết", value: "user.name" },
      { text: "Nội dung", value: "content" },
      { text: "Ngày đăng", value: "created_at" },
      { text: "Sửa đổi lần cuối lúc", value: "updated_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    posts: [],
  }),

  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.fetchAllPosts();
  },

  computed: {},

  methods: {
    truncateString(item) {
      return this.truncate(item);
    },
    fetchAllPosts() {
      this.showLoadingOverlay();
      AdminApis.getPostList()
        .then((value) => {
          this.posts = value;
        })
        .catch(() => {});
      this.hideLoadingOverlay();
    },

    viewPost(item) {
      return this.$router.push({ path: "/post/" + item.slug });
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      AdminApis.deletePost(this.editedItem.id)
        .then(() => {
          this.successAlert("Xóa thành công");
          this.fetchAllPosts();
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>