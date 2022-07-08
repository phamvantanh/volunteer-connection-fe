  <template>
  <div>
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
              <v-btn color="green">Đổi mật khẩu</v-btn>
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
    <v-card class="mx-auto mt-5" max-width="80%">
      <template v-if="user.role === 'volunteer'">
        <v-tabs fixed-tabs background-color="primary">
          <v-tab> Chứng chỉ tình nguyện </v-tab>
          <v-tab> Sự kiện của tôi </v-tab>
          <v-tab-item>
            <v-card>
              <v-card-title
                >Chứng chỉ tình nguyện mùa hè xanh 2021</v-card-title
              >
              <v-card-subtitle>Ngày cấp: 12/09/2021</v-card-subtitle>
              <v-btn>Xem chứng chỉ</v-btn>
            </v-card>
            <v-card>
              <v-card-title>Chứng chỉ Hiến máu nhân đạo</v-card-title>
              <v-card-subtitle>Ngày cấp: 23/05/2022</v-card-subtitle>
              <v-btn>Xem chứng chỉ</v-btn>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card class="mt-5" max-width="344">
              <v-img
                src="https://image.thanhnien.vn/w660/Uploaded/2022/slaohuo/2020_07_09/muahexanh_lethanh9_vuyb.jpg"
                height="200px"
              ></v-img>

              <v-card-title>
                ĐĂNG KÝ THAM GIA TÌNH NGUYỆN VIÊN HÈ
              </v-card-title>

              <v-card-actions>
                <v-btn color="orange lighten-2" text> Explore </v-btn>

                <v-spacer></v-spacer>

                <v-btn icon @click="show = !show">
                  <v-icon>{{
                    show ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>

                  <v-card-text>
                    I'm a thing. But, like most politicians, he promised more
                    than he could deliver. You won't have time for sleeping,
                    soldier, not with all the bed making you'll be doing. Then
                    we'll go with that data file! Hey, you add a one and two
                    zeros to that or we walk! You're going to do his laundry?
                    I've got to find a way to escape.
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </template>
      <template v-if="user.role === 'organization'">
        <v-tabs fixed-tabs background-color="primary">
          <v-tab> Bài viết </v-tab>
          <v-tab> Sự kiện </v-tab>
          <v-tab-item>
            <v-card class="mt-5" max-width="344">
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                height="200px"
              ></v-img>

              <v-card-title> TÌNH NGUYỆN VIỆT NAM </v-card-title>

              <v-card-actions>
                <v-btn color="orange lighten-2" text> Explore </v-btn>

                <v-spacer></v-spacer>

                <v-btn icon @click="show = !show">
                  <v-icon>{{
                    show ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>

                  <v-card-text>
                    I'm a thing. But, like most politicians, he promised more
                    than he could deliver. You won't have time for sleeping,
                    soldier, not with all the bed making you'll be doing. Then
                    we'll go with that data file! Hey, you add a one and two
                    zeros to that or we walk! You're going to do his laundry?
                    I've got to find a way to escape.
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card class="mt-5" max-width="344">
              <v-img
                src="https://image.thanhnien.vn/w660/Uploaded/2022/slaohuo/2020_07_09/muahexanh_lethanh9_vuyb.jpg"
                height="200px"
              ></v-img>

              <v-card-title>
                ĐĂNG KÝ THAM GIA TÌNH NGUYỆN VIÊN HÈ
              </v-card-title>

              <v-card-actions>
                <v-btn color="orange lighten-2" text> Explore </v-btn>

                <v-spacer></v-spacer>

                <v-btn icon @click="show = !show">
                  <v-icon>{{
                    show ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>

                  <v-card-text>
                    I'm a thing. But, like most politicians, he promised more
                    than he could deliver. You won't have time for sleeping,
                    soldier, not with all the bed making you'll be doing. Then
                    we'll go with that data file! Hey, you add a one and two
                    zeros to that or we walk! You're going to do his laundry?
                    I've got to find a way to escape.
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
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
export default {
  data: () => ({
    dialog: false,
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
  }),
  created() {
    this.getUserProfileByUrl(this.$route.params.url);
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
    nowDate() {
      return new Date().toJSON().slice(0, 10).replace(/-/g, "-");
    },
  },
  methods: {
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
      this.editedItem = this.user;
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },
    validateForm() {
      return this.$refs.formEdit.validate();
    },

    save() {
      if (this.validateForm()) {
        this.updateUserInfo();
      } else return;
    },

    updateUserInfo() {
      this.showLoadingOverlay();
      AdminApis.updateUser(this.editedItem)
        .then(() => {
          this.successAlert("Cập nhật thành công");
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
