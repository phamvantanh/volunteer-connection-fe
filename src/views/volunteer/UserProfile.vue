  <template>
  <div class="mt-5">
    <v-card v-if="showPage" class="mx-auto" max-width="80%">
      <v-row class="ma-0">
        <v-col cols="12" sm="3">
          <v-avatar color="white" size="200">
            <img :src="user.avatar_url" alt="avatar" />
          </v-avatar>
        </v-col>
        <v-col cols="12" sm="9">
          <v-row class="pa-5">
            <v-chip color="#F06292" class="white--text">
              {{
                user.role === "volunteer"
                  ? "Tình nguyện viên"
                  : user.role === "admin"
                  ? "Quản trị viên"
                  : "Ban tổ chức"
              }}
            </v-chip>
            <v-spacer></v-spacer>
            <div v-if="User && User.id === user.id">
              <v-btn color="primary" @click="editProfile()"
                >Chỉnh sửa trang thông tin</v-btn
              >
              <v-btn class="ml-4" color="green" @click="openChangePassDialog()"
                >Đổi mật khẩu</v-btn
              >
            </div>
          </v-row>
          <v-row class="pa-5 mt-0 pt-0">
            <div class="pr-2">
              <h2 class="green--text">{{ user.name }}</h2>
            </div>
          </v-row>
          <v-row class="pa-5 mt-0 pt-0">
            <div class="pr-2" v-if="user.role === 'volunteer'">
              <h3>Đang theo dõi 10 tổ chức</h3>
            </div>
            <div class="pr-2" v-if="user.role === 'organization'">
              <h3>10 tình nguyện viên theo dõi</h3>
            </div>
          </v-row>
          <v-row class="pa-5 mt-0 pt-0">
            <div class="pr-2">
              <h3>Số điện thoại: {{ user.phone }}</h3>
            </div>
            <v-spacer></v-spacer>
            <div class="pr-2" v-if="user.role !== 'organization'">
              <h3>Ngày sinh: {{ user.date_of_birth }}</h3>
            </div>
            <div class="pr-2" v-if="user.role === 'organization'">
              <h3>Ngày thành lập: {{ user.date_of_birth }}</h3>
            </div>
            <v-spacer></v-spacer>
          </v-row>
          <v-divider></v-divider>
          <v-row class="pa-5 mt-0 pt-0">
            <div class="pr-2" v-if="user.about">
              <h4 class="primary--text font-italic">"{{ user.about }}"</h4>
            </div>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog
      :value="dialog"
      max-width="600px"
      @keydown.esc="dialog = false"
      @click:outside="dialog = false"
    >
      <v-form ref="formEdit">
        <v-card>
          <v-card-title>
            <span class="text-h5">Chỉnh sửa thông tin</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="12">
                  <v-file-input
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Pick an avatar"
                    prepend-icon="mdi-camera"
                    label="Avatar"
                    v-model="editedItem.avatar_url"
                    @change="upload()"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="RuleList.name"
                    counter
                    maxlength="255"
                    label="Tên"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
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

                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    v-model="editedItem.about"
                    counter
                    maxlength="500"
                    label="Giới thiệu"
                  ></v-textarea>
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
    <v-dialog
      :value="dialogChangePass"
      max-width="400px"
      @keydown.esc="dialogChangePass = false"
      @click:outside="dialogChangePass = false"
    >
      <v-form ref="formChangePass">
        <v-card>
          <v-card-title>
            <span class="text-h5">Đổi mật khẩu</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="editedChangePassItem.old_password"
                    :rules="RuleList.password"
                    maxlength="64"
                    type="password"
                    label="Nhập mật khẩu cũ"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="editedChangePassItem.new_password"
                    :rules="RuleList.password"
                    label="Nhập mật khẩu mới"
                    type="password"
                    maxlength="64"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="editedChangePassItem.new_confirm_password"
                    :rules="passConfirmRules"
                    label="Nhập lại mật khẩu mới"
                    type="password"
                    maxlength="64"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeChangePass">
              Hủy
            </v-btn>
            <v-btn color="blue darken-1" text @click="saveChangePass">
              Lưu
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-card class="mx-auto mt-5" max-width="80%">
      <template v-if="user.role === 'volunteer'">
        <v-tabs fixed-tabs background-color="primary">
          <v-tab> Chứng chỉ tình nguyện </v-tab>
          <v-tab> Sự kiện </v-tab>
          <v-tab-item>
            <my-certificate :id="user.id"></my-certificate>
          </v-tab-item>

          <v-tab-item>
            <registered-event :id="user.id"></registered-event>
          </v-tab-item>
        </v-tabs>
      </template>
      <template v-if="user.role === 'organization'">
        <v-tabs fixed-tabs background-color="primary">
          <v-tab> Bài viết </v-tab>
          <v-tab> Sự kiện </v-tab>
          <v-tab-item>
            <my-post :id="user.id"></my-post>
          </v-tab-item>
          <v-tab-item>
            <my-event :id="user.id"></my-event>
          </v-tab-item>
        </v-tabs>
      </template>
    </v-card>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import rules from "../../mixins/rules";

import UserApis from "../../factories/user";
import AdminApis from "@/factories/admin";
import MyEvent from "@/components/MyEvent.vue";
import MyPost from "@/components/MyPost.vue";
import RegisteredEvent from "@/components/RegisteredEvent.vue";
import MyCertificate from "@/components/MyCertificate.vue";
import axios from "axios";
export default {
  components: { MyEvent, MyPost, RegisteredEvent, MyCertificate },
  data: () => ({
    dialog: false,
    dialogChangePass: false,
    genderItems: [
      { gender_vietnamese: "Nam", gender_english: "male" },
      { gender_vietnamese: "Nữ", gender_english: "female" },
      { gender_vietnamese: "Khác", gender_english: "unknown" },
    ],
    RuleList: rules,
    event: [],
    showPage: false,
    user: {},
    show: false,
    imageUpload: null,
    editedItem: {
      id: "",
      name: "",
      email: null,
      role: null,
      gender: null,
      phone: null,
      date_of_birth: null,
      avatar_url: null,
      about: null,
    },
    editedChangePassItem: {
      old_password: null,
      new_password: null,
      new_confirm_password: null,
    },
  }),
  created() {
    this.getUserProfileByUrl(this.$route.params.url);
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
    nowDate() {
      return new Date().toJSON().slice(0, 10).replace(/-/g, "-");
    },
    passConfirmRules() {
      return [
        (v) => !!v || "Hãy nhập mục này *",
        (v) =>
          v == this.editedChangePassItem.new_password ||
          "Mật khẩu không giống nhau",
      ];
    },
  },
  methods: {
    upload() {
      this.showLoadingOverlay();
      const formData = new FormData();
      formData.append("image", this.editedItem.avatar_url),
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
      this.hideLoadingOverlay();
    },
    getUserProfileByUrl(url) {
      this.showLoadingOverlay();
      UserApis.getUserProfile(url)
        .then((value) => {
          this.user = value;
          this.showPage = true;
        })
        .catch(() => {});
      this.hideLoadingOverlay();
    },
    editProfile() {
      this.editedItem = this.cloneDeep(this.user);
      this.editedItem.imageBefore = this.editedItem.avatar_url;
      this.dialog = true;
    },
    openChangePassDialog() {
      this.dialogChangePass = true;
      this.$refs.formChangePass.reset();
    },
    close() {
      this.dialog = false;
    },
    validateForm() {
      return this.$refs.formEdit.validate();
    },
    validateFormChangePass() {
      return this.$refs.formChangePass.validate();
    },

    save() {
      if (this.validateForm()) {
        this.updateUserInfo();
      } else return;
    },
    closeChangePass() {
      this.dialogChangePass = false;
    },
    saveChangePass() {
      if (this.validateFormChangePass()) {
        this.changePass();
      } else return;
    },
    changePass() {
      UserApis.changePass(this.editedChangePassItem)
        .then(() => {
          this.successAlert("Cập nhật thành công");
          this.closeChangePass();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.errorAlert("Kiểm tra các thông tin đã nhập");
          } else if (error.response.data.message === "Sai mật khẩu") {
            this.errorAlert("Mật khẩu cũ không chính xác");
          } else {
            this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
          }
        });
    },

    updateUserInfo() {
      this.showLoadingOverlay();
      this.editedItem.avatar_url = this.imageUpload
        ? this.imageUpload
        : this.editedItem.imageBefore;
      AdminApis.updateUser(this.editedItem)
        .then(() => {
          this.successAlert("Cập nhật thành công");
          this.$router.go();
          // this.close();
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
      this.hideLoadingOverlay();
    },
  },
};
</script>

<style scoped>
.divcontent {
  margin-bottom: -16px !important;
  background-color: red;
}
</style>>
