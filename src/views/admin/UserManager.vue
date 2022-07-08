<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :search="search"
    sort-by="created_at"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>QUẢN LÝ TÀI KHOẢN</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" @click="openDialog()">
          Thêm mới
        </v-btn>
        <v-dialog
          :value="dialog"
          max-width="600px"
          @keydown.esc="dialog = false"
          @click:outside="dialog = false"
        >
          <v-form ref="formEdit">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.name"
                        :rules="RuleList.name"
                        counter
                        maxlength="255"
                        label="Tên"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" v-if="editedIndex === -1">
                      <v-text-field
                        v-model="editedItem.email"
                        :rules="RuleList.email"
                        label="Email"
                        counter
                        maxlength="255"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" v-if="editedIndex !== -1">
                      <v-text-field
                        v-model="editedItem.email"
                        :rules="RuleList.email"
                        disabled
                        label="Email"
                        counter
                        maxlength="255"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        :items="roleItems"
                        v-model="editedItem.role"
                        :rules="RuleList.role"
                        item-text="role_vietnamese"
                        item-value="role_english"
                        label="Loại tài khoản"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        :items="genderItems"
                        v-model="editedItem.gender"
                        :rules="RuleList.gender"
                        label="Giới tính"
                        item-text="gender_vietnamese"
                        item-value="gender_english"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.phone"
                        :rules="RuleList.phone"
                        label="Số điện thoại"
                        counter
                        maxlength="10"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        type="date"
                        :rules="RuleList.date"
                        v-model="editedItem.date_of_birth"
                        label="Ngày sinh"
                        :max="nowDate"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" v-if="editedIndex === -1">
                      <v-text-field
                        type="password"
                        v-model="editedItem.password"
                        :rules="RuleList.password"
                        label="Mật khẩu"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" v-if="editedIndex === -1">
                      <v-text-field
                        type="password"
                        v-model="editedItem.password_confirmation"
                        :rules="passConfirmRules"
                        label="Nhập lại mật khẩu"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="editedIndex !== -1">
                      <v-text-field
                        v-model="editedItem.about"
                        counter
                        maxlength="500"
                        label="Giới thiệu"
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
          </v-form>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="400px">
          <v-card>
            <v-card-title class="text-h8 red--text"
              >Bạn chắc chắn muốn xóa tài khoản này?</v-card-title
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
    <template v-slot:[`item.avatar_url`]="{ item }">
      <v-avatar>
        <img :src="item.avatar_url" style="width: 50px; height: 50px"
      /></v-avatar>
    </template>
    <template v-slot:[`item.role`]="{ item }">
      <td class="text-start">
        <span v-if="item.role === 'admin'" :style="style.admin"
          >Quản trị viên</span
        >
        <span v-if="item.role === 'volunteer'" :style="style.volunteer"
          >Tình nguyện viên</span
        >
        <span v-if="item.role === 'organization'" :style="style.organization"
          >Ban tổ chức</span
        >
      </td>
    </template>
    <template v-slot:[`item.gender`]="{ item }">
      <td class="text-start">
        <span v-if="item.gender === 'male'">Nam</span>
        <span v-if="item.gender === 'female'">Nữ</span>
        <span v-if="item.gender === 'unknown'">Khác</span>
      </td>
    </template>
    <template v-slot:[`item.created_at`]="{ item }">
      <td class="text-start">
        <span>{{ item.created_at }}</span>
      </td>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="fetchAllUser"> Làm mới </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import AdminApis from "../../factories/admin";
import rules from "../../mixins/rules";

export default {
  data: () => ({
    search: "",
    dialog: false,
    RuleList: rules,
    dialogDelete: false,
    roleItems: [
      { role_vietnamese: "Tình nguyện viên", role_english: "volunteer" },
      { role_vietnamese: "Ban tổ chức", role_english: "organization" },
      { role_vietnamese: "Quản trị viên", role_english: "admin" },
    ],
    genderItems: [
      { gender_vietnamese: "Nam", gender_english: "male" },
      { gender_vietnamese: "Nữ", gender_english: "female" },
      { gender_vietnamese: "Khác", gender_english: "unknown" },
    ],
    style: {
      admin: "padding: 2px 7px;background-color: #dd4470 ;border-radius: 3px;",
      volunteer:
        "padding: 2px 7px;background-color: #4caf50 ;border-radius: 3px;",
      organization:
        "padding: 2px 7px;border: 1px solid #b3d7ff;background-color: #fe72a9 ;border-radius: 3px;",
    },
    headers: [
      { text: "Ảnh đại diện", value: "avatar_url" },
      {
        text: "Tên",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Email", value: "email" },
      { text: "Loại tài khoản", value: "role" },
      { text: "Giới tính", value: "gender" },
      { text: "Số điện thoại", value: "phone" },
      { text: "Ngày sinh", value: "date_of_birth" },
      { text: "Ngày tạo tài khoản", value: "created_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      name: "",
      email: null,
      role: null,
      gender: null,
      phone: null,
      password: null,
      date_of_birth: null,
      password_confirmation: null,
      avatar_url: null,
      about: null,
    },
    defaultItem: {
      id: "",
      name: "",
      email: null,
      role: null,
      gender: null,
      phone: null,
      password: null,
      password_confirmation: null,
      date_of_birth: null,
      avatar_url: null,
      about: null,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Tạo tài khoản mới" : "Sửa thông tin";
    },
    passConfirmRules() {
      return [
        (v) => !!v || "Hãy nhập mục này *",
        (v) => v == this.editedItem.password || "Mật khẩu không giống nhau",
      ];
    },
    nowDate() {
      return new Date().toJSON().slice(0, 10).replace(/-/g, "-");
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
    this.fetchAllUser();
  },

  methods: {
    openDialog() {
      this.dialog = true;
      this.unValidateForm();
    },

    validateForm() {
      return this.$refs.formEdit.validate();
    },
    unValidateForm() {
      if (this.$refs.formEdit) {
        return this.$refs.formEdit.resetValidation();
      }
    },
    fetchAllUser() {
      this.showLoadingOverlay();
      AdminApis.getUserList()
        .then((value) => {
          this.users = value;
        })
        .catch(() => {});
      this.hideLoadingOverlay();
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      AdminApis.deleteUser(this.editedItem.id)
        .then(() => {
          this.successAlert("Xóa thành công");
          this.fetchAllUser();
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
      if (this.validateForm()) {
        if (this.editedIndex > -1) {
          this.updateUserInfo();
        } else {
          this.addNewUser();
        }
      }
    },

    updateUserInfo() {
      this.showLoadingOverlay();
      AdminApis.updateUser(this.editedItem)
        .then(() => {
          this.successAlert("Cập nhật thành công");
          this.fetchAllUser();
          this.close();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            console.log(error.response.data);
            if (
              error.response.data ===
              '{"email":["The email has already been taken."]}'
            ) {
              this.errorAlert("Email đã tồn tại trong hệ thống");
            } else {
              this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
            }
          } else {
            this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
          }
        });
    },

    addNewUser() {
      this.showLoadingOverlay();
      this.editedItem.avatar_url =
        "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png";
      AdminApis.addUser(this.editedItem)
        .then(() => {
          this.successAlert("Thêm thành công");
          this.fetchAllUser();
          this.close();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            console.log(error.response.data);
            if (
              error.response.data ===
              '{"email":["The email has already been taken."]}'
            ) {
              this.errorAlert("Email đã tồn tại trong hệ thống");
            } else {
              this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
            }
          } else {
            this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
          }
        });
    },
  },
};
</script>
<style>
.role {
  color: aquamarine;
}
</style>
