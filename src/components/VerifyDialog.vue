<template>
  <v-dialog
    full-screen
    :value="visible"
    max-width="500px"
    @keydown.esc="$emit('close-dialog')"
    @click:outside="$emit('close-dialog')"
  >
    <v-form ref="verifyForm">
      <v-card>
        <v-card-title class="text-h5">
          Gửi liên kết xác thực email
        </v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            label="Email"
            v-model="email"
            :rules="emailRules"
            required
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()">Hủy</v-btn>
          <v-btn text color="success" @click="send"> GỬI</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import AuthApis from "../factories/auth";

export default {
  name: "verify-dialog",

  data() {
    return {
      email: null,
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  props: {
    visible: Boolean,
  },

  methods: {
    send() {
      if (this.$refs.verifyForm.validate()) {
        AuthApis.sendVerifyLink({
          email: this.email,
        })
          .then(() => {
            this.successAlert("Đã gửi liên kết đến email");
            this.closeDialog();
          })
          .catch((error) => {
            console.log(error.response.status);
            if (error.response.status === 401) {
              this.errorAlert("Địa chỉ email chưa chính xác.");
            } else if (error.response.status === 422) {
              this.successAlert("Địa chỉ email đã được xác thực.");
              this.closeDialog();
            } else this.errorAlert("Có lỗi xảy ra. Thử lại.");
          });
      }
    },

    closeDialog() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style>
</style>
