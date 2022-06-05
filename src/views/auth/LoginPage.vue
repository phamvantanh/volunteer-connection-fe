<template>
  <div class="bg">
    <v-container class="login-container">
      <v-card elevation="6" light tag="section">
        <v-card-title class="justify-center"> ĐĂNG NHẬP </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              outlined
              label="Email"
              :rules="emailRules"
              v-model="user.email"
              required
            ></v-text-field>
            <v-text-field
              outlined
              label="Mật khẩu"
              type="password"
              :rules="passRules"
              v-model="user.password"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="success" @click="submit"> Đăng nhập </v-btn>
        </v-card-actions>
        <v-divider></v-divider>
        <div class="divider">
          Bạn chưa có tài khoản?
          <router-link to="/register">Đăng ký</router-link>
        </div>
        <div>Quên mật khẩu?</div>
      </v-card>
    </v-container>
    <div class="text-center">
      <v-dialog
        :value="notVerifyDialog"
        @click:outside="notVerifyDialog = false"
        width="500"
      >
        <v-card>
          <v-card-title class="text-h8 lighten-2">
            TÀI KHOẢN CHƯA XÁC THỰC
          </v-card-title>
          <v-card-text>
            Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra email để xác
            thực hoặc yêu cầu có thể yêu cầu gửi lại đường dẫn xác thực.
            <v-btn block color="success" @click="verifyVisible = true">
              GỬI LẠI ĐƯỜNG DẪN XÁC THỰC</v-btn
            >
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <verify-dialog :visible.sync="verifyVisible"></verify-dialog>
  </div>
</template>

<script>
import CookiesService from "@/services/cookies.service";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      notVerifyDialog: false,
      verifyVisible: false,
      user: {
        email: null,
        password: null,
      },
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      passRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 6 || "Password must be more than 6 characters",
      ],
    };
  },

  created() {
    const token = CookiesService.getToken;
    if (token) {
      this.$router.push("/");
    }
  },

  methods: {
    validate() {
      return this.$refs.form.validate();
    },

    ...mapActions(["logIn"]),
    async submit() {
      if (this.validate()) {
        try {
          await this.logIn(this.user);
          this.$router.push("/");
        } catch (error) {
          if (error.response.status === 401) {
            this.errorAlert("Email or password incorrect");
          } else if (error.response.status === 400) {
            this.notVerifyDialog = true;
          } else {
            this.errorAlert("An error has occurred! Try again");
          }
        }
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
  padding: 0 10px 0px 10px;
}

h1 {
  font-weight: bold;
}

.login-container {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 80%;
  padding: 0;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 400px;
  align-content: center;
  border-radius: 5px;
}

.bg {
  background-image: url("../../assets/welcome.jpg");
  height: 100%;
  width: 80%;
  margin-left: -5%;
  background-position: center;
  background-size: cover;
}

@media only screen and (max-width: 1100px) {
  .bg {
    width: 100%;
    margin-left: 0%;
  }
  .login-container {
    left: 50%;
  }
}

.divider {
  padding-top: 10px;
}
</style>
