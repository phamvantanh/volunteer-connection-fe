<!-- eslint-disable -->
<template>
  <v-data-table
    :headers="headers"
    :items="events"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>QUẢN LÝ SỰ KIỆN</v-toolbar-title>
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
              >Bạn chắc chắn muốn xóa sự kiện này?</v-card-title
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
    <template v-slot:[`item.id`]="{ index }">
      <div>{{ index + 1 }}</div>
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <td class="text-start" v-if="item.status === 1">
        <span :style="style.open"> Open </span>
      </td>
      <td class="text-start" v-if="item.status === 0">
        <span :style="style.close"> Close </span>
      </td>
    </template>
    <template v-slot:[`item.is_published`]="{ item }">
      <td class="text-start" v-if="item.is_published === 1">
        <span :style="style.open"> Công khai </span>
      </td>
      <td class="text-start" v-if="item.is_published === 0">
        <span :style="style.close"> Riêng tư </span>
      </td>
    </template>
    <!-- <template v-slot:[`item.thumbnail`]="{ item }">
      <img :src="item.thumbnail" style="width: 50px; height: 50px" />
    </template> -->
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      <v-icon small @click="viewEvent(item)"> mdi-link-variant </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchAllEvents()"> Làm mới </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import AdminApis from "../../factories/admin";

export default {
  data: () => ({
    search: "",
    dialogDelete: false,
    style: {
      open: "padding: 1px 7px;background-color: #4caf50 ;border-radius: 3px;",
      close: "padding: 1px 7px;background-color: red ;border-radius: 3px;",
    },
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Tiêu đề", value: "title" },
      { text: "Thể loại", value: "category.name" },
      { text: "Tổ chức sự kiện", value: "user.name" },
      { text: "Hạn cuối đăng ký", value: "deadline" },
      { text: "Số lượng đăng ký", value: "registerNumber" },
      { text: "Ngày đăng", value: "created_at" },
      { text: "Trạng thái sự kiện", value: "status" },
      { text: "Trạng thái hiển thị", value: "is_published" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    events: [],
  }),

  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.fetchAllEvents();
  },

  methods: {
    viewEvent(item) {
      return this.$router.push({ path: "/event/" + item.slug });
    },

    fetchAllEvents() {
      this.showLoadingOverlay();
      AdminApis.getEventList()
        .then((value) => {
          this.events = value;
        })
        .catch(() => {});
      this.hideLoadingOverlay();
    },
    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      AdminApis.deleteEvent(this.editedItem.id)
        .then(() => {
          this.successAlert("Xóa thành công");
          this.fetchAllEvents();
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