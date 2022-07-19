<template>
  <div>
    <v-row class="mt-5 ml-5" v-if="User && User.id === id">
      <v-btn color="primary" @click="open(defaultItem)">Thêm chứng chỉ</v-btn>
    </v-row>
    <v-row dense class="mb-5 mt-5">
      <v-col
        v-for="certificate in certificateList"
        :key="certificate.id"
        cols="6"
      >
        <v-card height="280px">
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
          <v-btn
            @click="open(certificate)"
            v-if="User && User.id === id"
            class="ml-5"
            color="primary"
            >Chỉnh sửa</v-btn
          >
          <v-btn
            @click="deleteCertificate(certificate.id)"
            v-if="User && User.id === id"
            class="ml-5 white--text"
            color="red"
            >Xóa</v-btn
          >
          <v-btn
            @click="showCertificate(certificate)"
            v-if="User && User.id === id && !certificate.is_published"
            class="ml-5 white--text"
            color="green"
            >Công khai</v-btn
          >
          <v-btn
            @click="hideCertificate(certificate)"
            v-if="User && User.id === id && certificate.is_published"
            class="ml-5"
            color="close"
            >Ẩn chứng chỉ</v-btn
          >
        </v-card>
      </v-col>
      <edit-certificate
        :openDialog.sync="openDialog"
        :certificate="editedCertificate"
        @close-dialog="openDialog = false"
        @fetch-data="fetch()"
      ></edit-certificate>
    </v-row>
  </div>
</template>

<script>
import CertificateApis from "@/factories/certificate";
import { mapGetters } from "vuex";
import EditCertificate from "@/components/EditCertificate.vue";

export default {
  components: { EditCertificate },
  name: "my-certificate",
  data: () => ({
    certificates: [],
    editedCertificate: {},
    openDialog: false,
    defaultItem: {
      id: null,
      event_id: null,
      user_id: null,
      name: null,
      organization_name: null,
      issue_date: null,
      url: null,
    },
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
    this.fetch();
  },
  methods: {
    fetch() {
      CertificateApis.getMyCertificate(this.id)
        .then((value) => {
          this.certificates = value;
        })
        .catch(() => {});
    },

    deleteCertificate(id) {
      CertificateApis.deleteCertificate(id)
        .then(() => {
          this.successAlert("Xóa thành công");
          this.fetch();
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi, thử lại sau");
        });
    },
    openCertificate(url) {
      window.open(url, "_blank").focus();
    },
    open(certificate) {
      this.openDialog = true;
      this.editedCertificate = this.cloneDeep(certificate);
    },
    hideCertificate(certificate) {
      certificate.is_published = false;
      CertificateApis.updateCertificate(certificate)
        .then(() => {
          this.successAlert("Đã ẩn");
          this.fetch();
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
    },
    showCertificate(certificate) {
      certificate.is_published = true;
      CertificateApis.updateCertificate(certificate)
        .then(() => {
          this.successAlert("Đã công khai");
          this.fetch();
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
    },
  },
};
</script>

<style scoped>
</style>
