<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container>
    <v-btn
      color="primary"
      @click="openDialog(defaultItem)"
      :disabled="!checkRegistered()"
      >Viết đánh giá</v-btn
    >
    <strong class="mb-0 pl-5 font-italic text--secondary">
      Bạn chỉ có thể đánh giá khi được xác nhận đã tham gia sự kiện.
    </strong>
    <v-row dense class="mb-5 mt-5">
      <v-col
        v-for="review in reviews"
        :key="review.id"
        cols="12"
        style="background: #bfbfbf"
        class="mt-4 rounded-lg"
      >
        <v-card class="ma-1">
          <v-row>
            <v-col cols="12" sm="1" class="mt-10">
              <v-row justify="center">
                <v-avatar color="white" size="48">
                  <img :src="review.user.avatar_url" alt="avatar" />
                </v-avatar>
              </v-row>
            </v-col>
            <v-col cols="12" sm="11">
              <v-row class="mt-1">
                <v-card-subtitle
                  class="pa-0 pt-2 primary--text"
                  style="cursor: pointer"
                  @click="viewUser(review.user.url_account)"
                >
                  {{ review.user.name }}</v-card-subtitle
                >
                <v-spacer></v-spacer>
                <v-card-subtitle class="pa-0 pt-2 pr-5 gray--text">
                  {{ review.created_at }}</v-card-subtitle
                >
              </v-row>
              <v-row>
                <v-rating
                  class="pa-0"
                  readonly
                  v-model="review.rating"
                  background-color="orange lighten-3"
                  color="orange"
                ></v-rating>
              </v-row>
              <v-row>
                <v-card-text class="pa-0 pl-3 mb-7 text-wrap">
                  {{ review.content }}</v-card-text
                >
              </v-row>
              <v-row
                class="mb-1 ml-n7"
                v-if="User && User.id === review.user_id"
              >
                <v-btn
                  text
                  color="green"
                  style="text-transform: none"
                  @click="deleteReview(review.id)"
                  >Xóa</v-btn
                >
                <v-btn
                  text
                  color="green"
                  style="text-transform: none"
                  @click="openDialog(review)"
                  >Chỉnh sửa</v-btn
                >
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogEdit" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-container>
          <v-row>
            <v-spacer></v-spacer>
            <v-rating
              class="pa-0"
              v-model="editedItem.rating"
              background-color="orange lighten-3"
              color="orange"
              large
            ></v-rating>
            <v-spacer></v-spacer>
          </v-row>
          <v-row class="mt-5 mb-0 pb-0">
            <v-col cols="12" sm="12" md="12">
              <v-textarea
                clearable
                clear-icon="mdi-close-circle"
                v-model="editedItem.content"
                height="70px"
                outlined
                maxlength="255"
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Hủy </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Lưu </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import EventApis from "@/factories/event";
import { mapGetters } from "vuex";

export default {
  name: "review-component",
  data() {
    return {
      dialogEdit: false,
      reviews: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        content: null,
        rating: null,
      },
      defaultItem: {
        id: null,
        event_id: null,
        user_id: null,
        name: null,
        organization_name: null,
        issue_date: null,
        url: null,
      },
    };
  },
  props: {
    id: Number,
    register_list: Array,
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
    formTitle() {
      return this.editedIndex === -1 ? "Tạo đánh giá" : "Chỉnh sửa đánh giá";
    },
  },

  created() {
    this.fetchReviews(this.id);
  },
  methods: {
    checkRegistered() {
      if (this.User) {
        const $result = this.register_list.find(
          ({ user_id }) => user_id === this.User.id
        );

        if ($result && $result.is_confirmed === 1) {
          return true;
        } else {
          return false;
        }
      }
    },
    fetchReviews(id) {
      EventApis.getReviewEvent(id)
        .then((value) => {
          this.reviews = value;
        })
        .catch(() => {});
    },
    openDialog(review) {
      this.dialogEdit = true;
      this.editedIndex = this.reviews.indexOf(review);
      this.editedItem = this.cloneDeep(review);
    },
    close() {
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.editedItem = {
          id: null,
          content: null,
          rating: null,
        };
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        this.updateReview();
      } else {
        this.addNewReview();
      }
    },
    updateReview() {
      if (
        this.editedItem.content === "" ||
        this.editedItem.content === " " ||
        !this.editedItem.content
      ) {
        this.errorAlert("Nhập nội dung");
        return;
      } else {
        const data = {
          id: this.editedItem.id,
          content: this.editedItem.content,
          rating: this.editedItem.rating,
        };
        EventApis.updateReview(data)
          .then(() => {
            this.successAlert("Cập nhật thành công");
            this.fetchReviews(this.id);
            this.close();
          })
          .catch(() => {
            this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
          });
      }
    },
    addNewReview() {
      if (
        this.editedItem.content === "" ||
        this.editedItem.content === " " ||
        !this.editedItem.content
      ) {
        this.errorAlert("Nhập nội dung đánh giá");
        return;
      } else {
        const data = {
          event_id: this.id,
          content: this.editedItem.content,
          rating: this.editedItem.rating,
        };
        EventApis.addReview(data)
          .then(() => {
            this.successAlert("Đánh giá thành công");
            this.fetchReviews(this.id);
            this.close();
          })
          .catch(() => {
            this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
          });
      }
    },
    deleteReview(id) {
      EventApis.deleteReview(id)
        .then(() => {
          this.successAlert("Xóa đánh giá thành công");
          this.fetchReviews(this.id);
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi, thử lại sau");
        });
    },
    viewUser(url) {
      return this.$router.push({ path: "/user/" + url });
    },
  },
};
</script>

<style scoped>
.v-input__icon--append .v-icon {
  color: rgb(0, 85, 255);
}
</style>
