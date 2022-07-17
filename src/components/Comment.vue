<template>
  <v-container>
    <v-row class="mt-5" v-if="User">
      <v-col cols="12" sm="12">
        <v-textarea
          clearable
          clear-icon="mdi-close-circle"
          height="70px"
          v-model="newComment"
          placeholder="Nhập bình luận..."
          filled
          maxlength="255"
          append-icon="mdi-24px mdi-send"
          @click:append="addNewComment()"
        >
        </v-textarea>
      </v-col>
    </v-row>
    <v-row dense class="mb-5 mt-5">
      <v-col
        v-for="comment in comments"
        :key="comment.id"
        cols="12"
        style="background: #bfbfbf"
        class="mt-4 rounded-lg"
      >
        <v-card class="ma-1">
          <v-row>
            <v-col cols="12" sm="1" class="mt-5">
              <v-row justify="center">
                <v-avatar color="white" size="48">
                  <img :src="comment.user.avatar_url" alt="avatar" />
                </v-avatar>
              </v-row>
            </v-col>
            <v-col cols="12" sm="11">
              <v-row class="mt-1">
                <v-card-subtitle
                  class="pa-0 pt-2 primary--text"
                  style="cursor: pointer"
                  @click="viewUser(comment.user.url_account)"
                >
                  {{ comment.user.name }}</v-card-subtitle
                >
                <v-spacer></v-spacer>
                <v-card-subtitle class="pa-0 pt-2 pr-5 gray--text">
                  {{ comment.created_at }}</v-card-subtitle
                >
              </v-row>
              <v-row>
                <v-card-text class="pa-0 mb-7 text-wrap">
                  {{ comment.content }}</v-card-text
                >
              </v-row>
              <v-row class="mb-1 ml-n7">
                <v-btn
                  text
                  v-if="
                    (User && User.id === comment.user_id) ||
                    (User && User.id === organzation_id)
                  "
                  color="green"
                  style="text-transform: none"
                  @click="deleteComment(comment.id)"
                  >Xóa</v-btn
                >
                <v-btn
                  text
                  color="green"
                  v-if="User && User.id === comment.user_id"
                  style="text-transform: none"
                  @click="openDialog(comment)"
                  >Chỉnh sửa</v-btn
                >
              </v-row>
            </v-col>
          </v-row>
        </v-card>
        <template v-if="comment.replies.length > 0">
          <div v-for="reply in comment.replies" :key="reply.id">
            <v-layout justify-end>
              <v-card class="ma-1" width="90%">
                <v-row>
                  <v-col cols="12" sm="1" class="mt-5">
                    <v-row justify="center">
                      <v-avatar color="white" size="48">
                        <img :src="reply.user.avatar_url" alt="avatar" />
                      </v-avatar>
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="11">
                    <v-row class="mt-1">
                      <v-card-subtitle
                        class="pa-0 pt-2 primary--text"
                        style="cursor: pointer"
                        @click="viewUser(reply.user.url_account)"
                      >
                        {{ reply.user.name }}</v-card-subtitle
                      >
                      <v-spacer></v-spacer>
                      <v-card-subtitle class="pa-0 pt-2 pr-5 gray--text">
                        {{ reply.created_at }}</v-card-subtitle
                      >
                    </v-row>
                    <v-row class="mb-1">
                      <v-card-text class="pa-0 pt-0 pb-2 text-wrap">
                        {{ reply.content }}</v-card-text
                      >
                    </v-row>
                    <v-row class="mb-1 ml-n7">
                      <v-btn
                        text
                        v-if="
                          (User && User.id === reply.user_id) ||
                          (User && User.id === organzation_id)
                        "
                        color="green"
                        style="text-transform: none"
                        @click="deleteComment(reply.id)"
                        >Xóa</v-btn
                      >
                      <v-btn
                        v-if="User && User.id === reply.user_id"
                        text
                        color="green"
                        style="text-transform: none"
                        @click="openDialog(reply)"
                        >Chỉnh sửa</v-btn
                      >
                    </v-row>
                  </v-col>
                </v-row>
              </v-card>
            </v-layout>
          </div>
        </template>
        <template v-if="User">
          <v-layout>
            <v-row>
              <v-col cols="12" sm="1"></v-col>
              <v-col cols="12" sm="11" class="pa-3 pl-6 mt-1 pb-0">
                <v-textarea
                  clearable
                  clear-icon="mdi-close-circle"
                  v-model="comment.reply"
                  height="70px"
                  placeholder="Nhập bình luận phản hồi..."
                  outlined
                  maxlength="255"
                  append-icon="mdi-24px mdi-send"
                  @click:append="replyComment(comment)"
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-layout>
        </template>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogEdit" max-width="600px">
      <v-card>
        <v-container>
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
  name: "comment-component",
  data() {
    return {
      comments: [],
      newComment: "",
      dialogEdit: false,
      editedItem: {
        id: null,
        content: null,
      },
    };
  },
  props: {
    id: Number,
    organzation_id: String,
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
  },
  created() {
    this.fetchComments(this.id);
  },

  methods: {
    viewUser(url) {
      return this.$router.push({ path: "/user/" + url });
    },
    fetchComments(id) {
      EventApis.getCommentEvent(id)
        .then((value) => {
          this.comments = value;
        })
        .catch(() => {});
    },
    replyComment(cmt) {
      if (cmt.reply === "" || cmt.reply === " " || !cmt.reply) {
        this.errorAlert("Nhập nội dung bình luận");
        return;
      } else {
        const data = {
          event_id: this.id,
          content: cmt.reply,
          parent_id: cmt.id,
        };
        EventApis.addComment(data)
          .then(() => {
            this.successAlert("Bình luận thành công");
            this.fetchComments(this.id);
          })
          .catch(() => {
            this.errorAlert("Đã xảy ra lỗi, thử lại sau");
          });
      }
    },
    addNewComment() {
      if (
        this.newComment === "" ||
        this.newComment === " " ||
        !this.newComment
      ) {
        this.errorAlert("Nhập nội dung bình luận");
        return;
      } else {
        const data = {
          event_id: this.id,
          content: this.newComment,
        };
        EventApis.addComment(data)
          .then(() => {
            this.successAlert("Bình luận thành công");
            this.fetchComments(this.id);
            this.newComment = "";
          })
          .catch(() => {
            this.errorAlert("Đã xảy ra lỗi, thử lại sau");
          });
      }
    },
    deleteComment(id) {
      EventApis.deleteComment(id)
        .then(() => {
          this.successAlert("Xóa bình luận thành công");
          this.fetchComments(this.id);
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi, thử lại sau");
        });
    },
    openDialog(comment) {
      this.dialogEdit = true;
      this.editedItem = this.cloneDeep(comment);
    },
    close() {
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.editedItem = {
          id: null,
          content: null,
        };
      });
    },
    save() {
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
        };
        EventApis.updateComment(data)
          .then(() => {
            this.successAlert("Chỉnh sửa thành công");
            this.fetchComments(this.id);
            this.close();
          })
          .catch(() => {
            this.errorAlert("Đã xảy ra lỗi, thử lại sau");
          });
      }
    },
  },
};
</script>

<style scoped>
.v-input__icon--append .v-icon {
  color: rgb(0, 85, 255);
}
</style>
