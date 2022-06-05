!<template>
  <div>
    <v-card v-if="success">
      <v-card-text
        >Xác thực thành công. Đăng nhập
        <router-link to="/">tại đây</router-link>
      </v-card-text>
    </v-card>
    <v-card v-if="fail">
      <v-card-text
        >Đã xảy ra lỗi xác thực. Vui lòng kiểm tra lại liên kết. Bạn cũng có thể
        yêu cầu gửi lại liên kết.</v-card-text
      >
      <v-btn text color="success" @click="openDialog"> TẠI ĐÂY</v-btn>
    </v-card>
    <verify-dialog :visible.sync="verifyVisible"></verify-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      verifyVisible: false,
      success: false,
      fail: false,
    };
  },
  created() {
    console.log(this.$route.query.queryURL);
    axios
      .get(this.$route.query.queryURL)
      .then(() => {
        this.success = true;
      })
      .catch((error) => {
        this.fail = true;
        console.log(error.response.data.message);
      });
  },
  methods: {
    openDialog() {
      this.verifyVisible = true;
    },
  },
};
</script>

<style>
</style>