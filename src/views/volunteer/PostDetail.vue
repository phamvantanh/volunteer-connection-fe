  <template>
  <v-card v-if="showPage" class="mx-auto" max-width="80%" min-height="600px">
    <div class="d-flex justify-end" v-if="User">
      <v-btn
        icon
        color="red"
        @click="
          reportDialog = true;
          reason = null;
        "
      >
        <v-icon>mdi-36px mdi-minus-circle</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="reportDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Báo cáo bài viết</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-textarea 
          outlined
          name="input-7-4"
          label="Nhập lý do báo cáo"
          v-model="reason"
          class="pl-10 pr-10 pt-5"
          max-length="255"
          counter=""
        ></v-textarea>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="reportDialog = false">
            Hủy
          </v-btn>
          <v-btn color="blue darken-1" text @click="report()"> Báo cáo </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card-title
      class="text-start text-wrap pt-0"
      style="text-transform: none"
      max-width="50%"
      >{{ post.title }}
    </v-card-title>
    <v-row v-if="User && User.id === post.user_id" class="pt-4 pl-10">
      <v-btn
        style="text-transform: none"
        color="primary"
        class="pb-0 white--text"
        @click.stop="editPost(post.slug)"
        >Chỉnh sửa bài viết</v-btn
      >
      <v-dialog v-model="dialogDelete" max-width="400px">
        <v-card>
          <v-card-title class="text-h8 red--text text-center"
            >Bạn chắc chắn muốn xóa bài viết này?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDelete">Hủy</v-btn>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm"
              >Xóa</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
        style="text-transform: none"
        color="red"
        class="pb-0 white--text ml-4"
        @click.stop="dialogDelete = true"
        >Xóa bài viết</v-btn
      >
    </v-row>
    <v-row class="pa-4">
      <v-card-subtitle class="pb-0 pt-0"
        >Người đăng:
        <v-btn
          text
          style="text-transform: none"
          color="green"
          class="pb-0"
          @click.stop="viewUser(post.user.url_account)"
          >{{ post.user.name }}</v-btn
        ></v-card-subtitle
      >
      <v-spacer></v-spacer>
      <v-card-subtitle class="pb-2 pt-1"
        >Chỉnh sửa lần cuối lúc:
        {{ post.updated_at.substring(0, 10) }}</v-card-subtitle
      >
    </v-row>
    <v-divider></v-divider>
    <div style="divcontent" class="pa-4" v-html="this.post.content"></div>

    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
import PostApis from "../../factories/post";
import { mapGetters } from "vuex";
import AdminApis from "@/factories/admin";
export default {
  data: () => ({
    reportDialog: false,
    dialogDelete: false,
    post: {},
    showPage: false,
    reason: null,
  }),
  created() {
    this.getPostDetail(this.$route.params.slug);
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
  },
  methods: {
    editPost(slug) {
      return this.$router.push({ path: "/post/" + slug + "/edit" });
    },
    getPostDetail(slug) {
      this.showLoadingOverlay();
      PostApis.getPostDetail(slug)
        .then((value) => {
          this.post = value;
          this.showPage = true;
        })
        .catch(() => {});
      this.hideLoadingOverlay();
    },
    viewUser(url) {
      return this.$router.push({ path: "/user/" + url });
    },
    report() {
      this.showLoadingOverlay();
      if (this.reason) {
        const post = {
          post_id: this.post.id,
          reason: this.reason,
        };
        PostApis.report(post)
          .then(() => {
            this.successAlert("Báo cáo bài viết thành công!");
            this.reportDialog = false;
          })
          .catch(() => {
            this.errorAlert("Đã xảy ra lỗi! Thử lại sau.");
          });
        this.hideLoadingOverlay();
      } else {
        this.errorAlert("Hãy nhập lý do báo cáo");
        this.hideLoadingOverlay();
      }
    },
    deleteItemConfirm() {
      AdminApis.deletePost(this.post.id)
        .then(() => {
          this.successAlert("Xóa thành công");
          this.$router.push({ path: "/" });
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi. Thử lại sau!");
        });
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
    },
    
  },
};
</script>

<style scoped>
.divcontent {
  margin-bottom: -16px !important;
  background-color: red;
}
</style>>
