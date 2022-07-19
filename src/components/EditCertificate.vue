<template>
  <v-dialog
    :value="openDialog"
    max-width="600px"
    @keydown.esc="$emit('close-dialog')"
    @click:outside="$emit('close-dialog')"
  >
    <v-form ref="formEdit">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-file-input
                  accept="image/png, image/jpeg, image/bmp"
                  :rules="[(v) => !!v || 'Hãy nhập mục này *']"
                  placeholder="Tải lên chứng chỉ"
                  prepend-icon="mdi-camera"
                  label="Ảnh chứng chỉ"
                  v-model="editedItem.url"
                  @change="upload()"
                ></v-file-input>
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field
                  v-model="editedItem.name"
                  :rules="[(v) => !!v || 'Hãy nhập mục này *']"
                  counter
                  maxlength="255"
                  label="Tên chứng chỉ"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field
                  v-model="editedItem.organization_name"
                  :rules="[(v) => !!v || 'Hãy nhập mục này *']"
                  counter
                  maxlength="255"
                  label="Tên tổ chức"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  type="date"
                  :rules="[(v) => !!v || 'Hãy nhập mục này *']"
                  v-model="editedItem.issue_date"
                  label="Ngày cấp chứng chỉ"
                  :max="nowDate"
                ></v-text-field>
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
</template>

<script>
import CertificateApis from "@/factories/certificate";
import axios from "axios";
export default {
  data: () => ({
    imageUpload: null,
    editedItem: {
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
    openDialog: Boolean,
    certificate: Object,
  },
  computed: {
    formTitle() {
      return this.editedItem.id === null ? "Thêm chứng chỉ" : "Sửa thông tin";
    },
    nowDate() {
      return new Date().toJSON().slice(0, 10).replace(/-/g, "-");
    },
  },
  watch: {
    openDialog: {
      handler(openDialog) {
        if (this.$refs.formEdit) {
          this.$refs.formEdit.resetValidation();
        }
        if (openDialog) {
          this.editedItem = this.certificate;
          this.editedItem.user_id = this.certificate.user_id;
        }
      },
      immediate: true,
    },
  },

  created() {},
  methods: {
    upload() {
      this.showLoadingOverlay();
      const formData = new FormData();
      formData.append("image", this.editedItem.url),
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
    close() {
      this.$emit("update:openDialog", false);
    },
    fetchDataComponent() {
      this.$emit("fetch-data");
    },
    validateForm() {
      return this.$refs.formEdit.validate();
    },
    save() {
      if (this.validateForm()) {
        if (!this.editedItem.id) {
          this.addNewCertificate();
        } else {
          this.updateCertificate();
        }
      } else return;
    },
    updateCertificate() {
      this.editedItem.url = this.imageUpload
        ? this.imageUpload
        : this.editedItem.url;
      CertificateApis.updateCertificate(this.editedItem)
        .then(() => {
          this.successAlert("Cập nhật thành công");
          this.close();
          this.fetchDataComponent();
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
    },

    addNewCertificate() {
      if (!this.imageUpload) {
        this.errorAlert("Hãy thử tải lên lại ảnh chứng chỉ");
      } else {
        this.editedItem.url = this.imageUpload;
        CertificateApis.addNewCertificate(this.editedItem)
          .then(() => {
            this.successAlert("Thêm thành công");
            this.close();
            this.fetchDataComponent();
          })
          .catch(() => {
            this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
          });
      }
    },
  },
};
</script>

<style>
</style>