<template>
  <v-row dense class="mb-5 mt-5">
    <v-col
      v-for="certificate in certificateList"
      :key="certificate.id"
      cols="6"
    >
      <v-card :height="User && User.id === id ? '250px' : '200px'">
        <v-card-title>{{ certificate.name }}</v-card-title>
        <v-card-subtitle class="mt-1 pb-0"
          >Đơn vị cấp chứng chỉ :
          {{ certificate.organization_name }}</v-card-subtitle
        >
        <v-card-subtitle
          >Ngày cấp: {{ certificate.issue_date }}</v-card-subtitle
        >
        <v-row v-if="User && User.id === id" class="mb-5 mt-1">
          <v-chip
            class="ml-4"
            :color="certificate.is_published ? 'green' : 'close'"
            text-color="white"
          >
            Hiển thị:
            {{ certificate.is_published ? "Công khai" : "Chỉ mình tôi" }}
          </v-chip>
        </v-row>
        <v-btn @click="openCertificate(certificate.url)">Xem chứng chỉ</v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import CertificateApis from "@/factories/certificate";
import { mapGetters } from "vuex";
export default {
  name: "my-certificate",
  data: () => ({
    certificates: [],
  }),
  props: {
    id: String,
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
    certificateList() {
      if (this.User && this.id === this.User.id) {
        return this.certificates;
      } else {
        return this.certificates.filter(
          (certificate) => certificate.is_published === 1
        );
      }
    },
  },
  created() {
    CertificateApis.getMyCertificate(this.id)
      .then((value) => {
        this.certificates = value;
      })
      .catch(() => {});
  },
  methods: {
    openCertificate(url) {
      window.open(url, "_blank").focus();
    },
  },
};
</script>

<style scoped>
</style>
