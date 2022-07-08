<template>
  <v-container fluid tag="section" style="margin-top: 10%">
    <v-row>
      <v-col cols="12" sm="6" lg="12">
        <v-card elevation="2" shaped color="primary">
          <v-card-title class="text-h6 white--text justify-center">
            Số lượng tình nguyện viên: {{ info.numberVolunteer }}
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="12" class="mt-3">
        <v-card elevation="2" shaped color="success">
          <v-card-title class="text-h6 white--text justify-center">
            Số lượng tổ chức tình nguyện: {{ info.numberOrganization }}
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="12" class="mt-3">
        <v-card elevation="2" shaped color="orange">
          <v-card-title class="text-h6 white--text justify-center">
            Số lượng sự kiện: {{ info.numberEvent }}
          </v-card-title>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="12" class="mt-3">
        <v-card elevation="2" shaped color="pink">
          <v-card-title class="text-h6 white--text justify-center">
            Số lượng bài viết: {{ info.numberPost }}
          </v-card-title>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="12" class="mt-3">
        <v-card elevation="2" shaped color="red">
          <v-card-title class="text-h6 white--text justify-center">
            Số lượng báo cáo chưa xử lý: {{ info.numberReportNotSolved }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AdminApis from "../../factories/admin";
export default {
  name: "DashBoard",
  data: () => ({
    info: {
      numberVolunteer: 0,
      numberOrganization: 0,
      numberEvent: 0,
      numberPost: 0,
      numberReportNotSolved: 0,
    },
  }),
  created() {
    AdminApis.getDashBoardInfo()
      .then((value) => {
        this.info = value;
      })
      .catch(() => {});
  },
};
</script>

<style scoped>
</style>
