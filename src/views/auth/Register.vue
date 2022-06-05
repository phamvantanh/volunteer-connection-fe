<template>
  <v-container class="register-container">
    <v-card light tag="section">
      <v-card-title class="justify-center"> ĐĂNG KÝ </v-card-title>
      <v-tabs fixed-tabs background-color="green" v-model="tab" dark>
        <v-tab>TÌNH NGUYỆN VIÊN </v-tab>
        <v-tab>TỔ CHỨC TÌNH NGUYỆN </v-tab>
        <v-tab-item>
          <v-card-text>
            <v-form ref="formVolunteerRegister">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Email"
                    v-model="volunteer.email"
                    :rules="emailRules"
                    required
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Tên"
                    type="text"
                    v-model="volunteer.name"
                    :rules="nameRules"
                    required
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Ngày tháng năm sinh"
                    type="date"
                    v-model="volunteer.dateOfBirth"
                    :rules="dateRules"
                    required
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Số điện thoại"
                    type="text"
                    v-model="volunteer.phone"
                    :rules="phoneRules"
                    required
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Mật khẩu"
                    type="password"
                    v-model="volunteer.password"
                    :rules="passRules"
                    required
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Nhập lại mật khẩu"
                    type="password"
                    v-model="volunteer.passwordConfirm"
                    :rules="passConfirmRules"
                    required
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="success" @click="registerByVolunteer">
              Đăng ký với vai trò tình nguyện viên
            </v-btn>
          </v-card-actions>
        </v-tab-item>
        <v-tab-item>
          <v-card-text>
            <v-form ref="formOrganizationRegister">
              <v-row>
                <v-col cols="12" sm="12">
                  <v-text-field
                    outlined
                    label="Email"
                    v-model="organization.email"
                    :rules="emailRules"
                    required
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    outlined
                    label="Tên tổ chức"
                    type="text"
                    v-model="organization.name"
                    :rules="nameRules"
                    required
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Ngày thành lập"
                    type="date"
                    v-model="organization.dateOfBirth"
                    :rules="dateRules"
                    required
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Số điện thoại"
                    type="text"
                    v-model="organization.phone"
                    :rules="phoneRules"
                    dense
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Mật khẩu"
                    type="password"
                    :rules="passRules"
                    v-model="organization.password"
                    required
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    label="Nhập lại mật khẩu"
                    type="password"
                    v-model="organization.passwordConfirm"
                    :rules="passConfirmRules"
                    required
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="success" @click="registerByOrganization">
              Đăng ký với vai trò tổ chức tình nguyện</v-btn
            >
          </v-card-actions>
        </v-tab-item>
      </v-tabs>

      <v-divider></v-divider>
      <div class="divider">
        Bạn đã có tài khoản? <router-link to="/">Đăng nhập</router-link>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import AuthApis from "../../factories/auth";

export default {
  name: "RegisterPage",
  data() {
    return {
      volunteer: {
        email: null,
        name: null,
        dateOfBirth: null,
        phone: null,
        password: null,
        passwordConfirm: null,
      },
      organization: {
        email: null,
        name: null,
        dateOfBirth: null,
        phone: null,
        password: null,
        passwordConfirm: null,
      },
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      nameRules: [
        (v) => !!v || "Name is required",
        (v) =>
          !this.startsWithoutSpace(v, " ") || "Không chứa kí tự trống đầu tiên",
      ],
      dateRules: [(v) => !!v || "Date is required"],
      phoneRules: [
        (v) => !!v || "Phone is required",
        (v) => this.size(v) >= 10 || "Phone must be more than 10 characters",
      ],
      passRules: [
        (v) => !!v || "Password is required",
        (v) => this.size(v) >= 6 || "Password must be more than 6 characters",
      ],
      passConfirmRules: [
        (v) => !!v || "Password is required",
        (v) => v == this.volunteer.password || "Mật khẩu không giống nhau",
      ],
    };
  },

  methods: {
    validateVolunteer() {
      return this.$refs.formVolunteerRegister.validate();
    },

    validateOrganization() {
      return this.$refs.formOrganizationRegister.validate();
    },

    registerByVolunteer() {
      if (this.validateVolunteer()) {
        const volunteerInfo = {
          name: this.volunteer.name,
          email: this.volunteer.email,
          password: this.volunteer.password,
          password_confirmation: this.volunteer.passwordConfirm,
          role: "volunteer",
          date_of_birth: this.volunteer.dateOfBirth,
          phone: this.volunteer.phone,
        };
        console.log(volunteerInfo);
        AuthApis.registerUser(volunteerInfo)
          .then(() => {
            this.successAlert("Register Success!!!");
          })
          .catch((error) => {
            const errorList = Object.values(error.response.data.message).join(
              ""
            );
            console.log(errorList);
            this.errorAlert("Register fails! Try again ");
          });
      }
    },

    registerByOrganization() {
      if (this.validateOrganization()) {
        const organizationInfo = {
          name: this.organization.name,
          email: this.organization.email,
          password: this.organization.password,
          password_confirmation: this.organization.passwordConfirm,
          role: "organization",
          date_of_birth: this.organization.dateOfBirth,
          phone: this.organization.phone,
        };
        console.log(organizationInfo);
        AuthApis.registerUser(organizationInfo)
          .then(() => {
            this.successAlert("Register Success!!!");
          })
          .catch((error) => {
            const errorList = Object.values(error.response.data.message).join(
              ""
            );
            console.log(errorList);
            this.errorAlert("Register fails! Try again ");
          });
      }
    },
  },
};
</script>
<style>
.v-btn,
.v-card {
  border-radius: 4px;
  padding: 10px;
}

.v-card__title {
  text-transform: uppercase;
  color: #30ac7c;
  padding: 15px;
  font-size: 30px;
}

.v-card__text {
  padding: 20px 10px 0px 10px;
}

.v-tabs-bar {
  height: 40px;
  border-radius: 4px;
  padding-bottom: 1px;
}

h1 {
  font-weight: bold;
}

.register-container {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 0;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 600px;
  align-content: center;
  border-radius: 5px;
}

.divider {
  padding-top: 10px;
}

.col-12 {
  padding: 0px 12px;
}
</style>
