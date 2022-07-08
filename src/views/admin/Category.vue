<template>
  <v-data-table
    :headers="headers"
    :items="categories"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>QUẢN LÝ THỂ LOẠI SỰ KIỆN</v-toolbar-title>
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
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Thêm mới
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6" v-if="editedIndex !== -1">
                    <v-text-field disabled label="ID" :value="editedItem.id">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="12">
                    <v-text-field
                      v-model="editedItem.name"
                      :rules="categoryRules"
                      counter
                      maxlength="255"
                      label="Tên thể loại"
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
        <v-dialog v-model="dialogDelete" max-width="400px">
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
    <template v-slot:[`item.indexx`]="{ index }">
      <div>{{ index + 1 }}</div>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)" v-if="item.numberEvent===0" > mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchAllCategory()"> Làm mới </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import AdminApis from "../../factories/admin";

export default {
  name: "CategoryManager",
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    categoryRules: [(v) => !!v || "Hãy nhập mục này *"],
    headers: [
      { text: "STT", value: "indexx" },
      {
        text: "Tên",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "Số lượng sự kiện",
        value: "numberEvent",
      },
      { text: "Ngày tạo ", value: "created_at" },
      { text: "Sửa đổi lần cuối lúc", value: "updated_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    categories: [],
    editedIndex: -1,
    editedItem: {
      name: null,
      id: null,
      created_at: null,
    },
    defaultItem: {
      name: null,
      id: null,
      created_at: null,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Thêm thể loại mới" : "Sửa thông tin";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.fetchAllCategory();
  },

  methods: {
    fetchAllCategory() {
      this.showLoadingOverlay();
      AdminApis.getAllCategory()
        .then((value) => {
          this.categories = value;
        })
        .catch(() => {});
      this.hideLoadingOverlay();
    },

    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      AdminApis.deleteCategory(this.editedItem.id)
        .then(() => {
          this.successAlert("Xóa thành công");
          this.fetchAllCategory();
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
      if (this.editedIndex > -1) {
        this.updateCategory();
      } else {
        this.addNewCategory();
      }
    },
    updateCategory() {
      this.showLoadingOverlay();
      AdminApis.updateCategory(this.editedItem)
        .then(() => {
          this.successAlert("Cập nhật thành công");
          this.fetchAllCategory();
          this.close();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            console.log(error.response.data);
            if (
              error.response.data ===
              '{"name":["The name has already been taken."]}'
            ) {
              this.errorAlert("Thể loại này đã tồn tại trong hệ thống");
            } else {
              this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
            }
          } else {
            this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
          }
        });
      // this.hideLoadingOverlay();
    },

    addNewCategory() {
      this.showLoadingOverlay();
      AdminApis.addCategory(this.editedItem)
        .then(() => {
          this.successAlert("Thêm thành công");
          this.fetchAllCategory();
          this.close();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            console.log(error.response.data);
            if (
              error.response.data ===
              '{"name":["The name has already been taken."]}'
            ) {
              this.errorAlert("Thể loại đã tồn tại trong hệ thống");
            } else {
              this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
            }
          } else {
            this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
          }
        });
      // this.hideLoadingOverlay();
    },
  },
};
</script>
<style>
</style>
