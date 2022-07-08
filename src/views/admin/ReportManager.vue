<template>
  <v-data-table
    :headers="headers"
    :items="reports"
    :search="search"
    sort-by="eventNumber"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>QUẢN LÝ BÁO CÁO</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Xử lý báo cáo</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.id"
                      label="ID"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.user_name"
                      label="Người báo cáo"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.reason"
                      label="Lý do"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      :items="itemSolved"
                      v-model="editedItem.is_solved"
                      item-text="text"
                      item-value="value"
                      label="Trạng thái xử lý"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="12">
                    <label>Quyết định xử lý</label>
                    <v-radio-group v-model="radios" mandatory>
                      <v-radio label="Khác" value="Khác"></v-radio>
                      <v-radio
                        label="Xóa bài viết"
                        value="Xóa bài viết"
                      ></v-radio>
                    </v-radio-group>
                    <v-text-field
                      v-if="radios == 'Khác'"
                      v-model="editedItem.decision"
                      label="Nhập nội dung"
                      counter
                      maxlength="255"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Hủy </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Lưu </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h8 red--text"
              >Bạn chắc chắn muốn xóa thể loại sự kiện này?</v-card-title
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
    <template v-slot:[`item.is_solved`]="{ item }">
      <td class="text-start">
        <span v-if="item.is_solved" :style="style.isSolved">Đã xử lý</span>
        <span v-if="!item.is_solved" :style="style.notSolved">Chưa xử lý</span>
      </td>
    </template>
    <template v-slot:[`item.indexx`]="{ index }">
      <div>{{ index + 1 }}</div>
    </template>
    <template v-slot:[`item.view`]="{ item }">
      <v-icon small @click="viewPost(item)"> mdi-link-variant </v-icon>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchAllReports"> Làm mới </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import AdminApis from "../../factories/admin";

export default {
  name: "ReportManager",
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    radios: null,
    itemSolved: [
      { text: "Đã xử lý", value: 1 },
      { text: "Chưa xử lý", value: 0 },
    ],
    style: {
      isSolved:
        "padding: 1px 7px;background-color: #4caf50 ;border-radius: 3px;",
      notSolved: "padding: 1px 7px;background-color: red ;border-radius: 3px;",
    },
    headers: [
      { text: "STT", value: "indexx" },
      {
        text: "Người báo cáo",
        align: "start",
        sortable: false,
        value: "user_name",
      },
      {
        text: "Bài viết",
        value: "title",
      },
      { text: "Lý do báo cáo", value: "reason" },
      { text: "Trạng thái", value: "is_solved" },
      { text: "Ngày báo cáo ", value: "created_at" },
      { text: "Xem bài viết", value: "view" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    reports: [],
    editedIndex: -1,
    editedItem: {
      id: null,
      reason: null,
      created_at: null,
    },
    defaultItem: {
      id: null,
      reason: null,
      created_at: null,
    },
  }),

  created() {
    this.fetchAllReports();
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    radios(val) {
      if (val === "Xóa bài viết") {
        this.editedItem.decision = "Xóa bài viết";
      }
    },
  },

  methods: {
    fetchAllReports() {
      this.showLoadingOverlay();
      AdminApis.getReportList()
        .then((value) => {
          this.reports = value;
        })
        .catch(() => {});
      this.hideLoadingOverlay();
    },

    viewPost(item) {
      return this.$router.push({ path: "/posts/" + item.slug });
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.reports.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      AdminApis.deleteReport(this.editedItem.id)
        .then(() => {
          this.successAlert("Xóa thành công");
          this.fetchAllReports();
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.showLoadingOverlay();
      AdminApis.updateReport(this.editedItem)
        .then((value) => {
          if (value.data.Message === "Post deleted! Report is solved") {
            this.successAlert("Đã xóa bài viết và báo cáo liên quan");
          } else {
            this.successAlert("Cập nhật xử lý thành công");
          }
          this.fetchAllReports();
          this.close();
          this.hideLoadingOverlay();
        })
        .catch((error) => {
          console.log(error.response);
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
          this.hideLoadingOverlay();
        });
    },
  },
};
</script>
<style>
</style>
