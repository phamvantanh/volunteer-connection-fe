<template>
  <v-container>
    <v-btn color="blue darken-1" class="mb-5" @click="viewEvent()">
      Quay lại trang sự kiện
    </v-btn>
    <v-data-table :headers="headers" :items="userList" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Danh sách tình nguyện viên đăng ký</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <!-- <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Item
            </v-btn>
          </template> -->
            <v-card>
              <v-card-title>
                <span class="text-h5">Xác nhận tham gia</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        v-model="editedItem.user.name"
                        label="Tên tình nguyện"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        :items="itemConfirmed"
                        v-model="editedItem.is_confirmed"
                        item-text="text"
                        item-value="value"
                        label="Trạng thái xử lý"
                      ></v-select>
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
              <v-card-title class="text-h5 text--center"
                >Xóa tình nguyện viên khỏi danh sách?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Hủy</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >Đồng ý</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.user.gender`]="{ item }">
        <td class="text-start">
          <span v-if="item.user.gender === 'male'">Nam</span>
          <span v-if="item.user.gender === 'female'">Nữ</span>
          <span v-if="item.user.gender === 'unknown'">Khác</span>
        </td>
      </template>
      <template v-slot:[`item.is_confirmed`]="{ item }">
        <td class="text-start">
          <span v-if="item.is_confirmed" :style="style.isSolved"
            >Đã xác nhận</span
          >
          <span v-if="!item.is_confirmed" :style="style.notSolved"
            >Chưa xác nhận</span
          >
        </td>
      </template>
      <template v-slot:[`item.indexx`]="{ index }">
        <div>{{ index + 1 }}</div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:[`item.certificates`]="{ item }">
        <v-btn
          v-if="item.certificate && item.certificate.url"
          @click="openCertificate(item.certificate.url)"
        >
          Xem chứng chỉ
        </v-btn>
        <v-btn
          v-if="!item.certificate"
          color="green"
          @click="setCertificate(item)"
          >Cấp chứng chỉ
        </v-btn>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="fetchData()">
          Reset
        </v-btn>
      </template>
    </v-data-table>
    <edit-certificate
      :openDialog.sync="openDialog"
      :certificate="editedCertificate"
      @close-dialog="openDialog = false"
      @fetch-data="fetchData()"
    ></edit-certificate>
  </v-container>
</template>
<script>
import EventApis from "@/factories/event";
import EditCertificate from "@/components/EditCertificate.vue";
export default {
  components: { EditCertificate },
  data: () => ({
    dialog: false,
    openDialog: false,
    dialogDelete: false,
    itemConfirmed: [
      { text: "Đã xác nhận", value: 1 },
      { text: "Chưa xác nhận", value: 0 },
    ],
    style: {
      isSolved:
        "padding: 1px 7px;background-color: #4caf50 ;border-radius: 3px;",
      notSolved: "padding: 1px 7px;background-color: gray ;border-radius: 3px;",
    },
    headers: [
      { text: "STT", value: "indexx" },
      {
        text: "Tên",
        align: "start",
        sortable: false,
        value: "user.name",
      },
      { text: "Email", value: "user.email" },
      { text: "Giới tính", value: "user.gender" },
      { text: "Số điện thoại", value: "user.phone" },
      { text: "Ngày sinh", value: "user.date_of_birth" },
      { text: "Thời gian đăng ký", value: "created_at" },
      {
        text: "Trạng thái xác nhận",
        align: "start",
        sortable: false,
        value: "is_confirmed",
      },
      { text: "Thao tác", value: "actions", sortable: false },
      { text: "Cấp chứng chỉ", value: "certificates", sortable: false },
    ],
    userList: [],
    editedCertificate: {
      id: null,
      event_id: null,
      user_id: null,
      name: null,
      organization_name: null,
      issue_date: null,
      url: null,
    },
    editedItem: {
      user_id: "",
      event_id: null,
      is_confirmed: null,
      certificate_id: null,
      user: {
        name: "",
      },
    },
    defaultItem: {
      user_id: "",
      event_id: null,
      is_confirmed: null,
      certificate_id: null,
      user: {
        name: "",
      },
    },
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      EventApis.getUserListOfEvent(this.$route.params.id)
        .then((value) => {
          this.userList = value;
        })
        .catch(() => {});
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const data = {
        user_id: this.editedItem.user_id,
        event_id: this.editedItem.event_id,
      };
      EventApis.removeVolunteer(data)
        .then(() => {
          this.successAlert("Xóa thành công");
          this.fetchData();
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
    },

    closeDelete() {
      this.dialogDelete = false;
    },
    viewEvent() {
      this.$router.go(-1);
    },

    save() {
      const data = {
        user_id: this.editedItem.user_id,
        event_id: this.editedItem.event_id,
        is_confirmed: this.editedItem.is_confirmed,
      };
      EventApis.updateVolunteer(data)
        .then(() => {
          this.successAlert("Cập nhật thành công");
          this.fetchData();
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
      this.close();
    },
    openCertificate(url) {
      window.open(url, "_blank").focus();
    },
    setCertificate(item) {
      console.log(item);
      this.openDialog = true;
      this.editedCertificate = {
        id: null,
        event_id: item.event_id,
        user_id: item.user_id,
        name: null,
        organization_name: null,
        issue_date: null,
        url: null,
      };
    },
  },
};
</script>