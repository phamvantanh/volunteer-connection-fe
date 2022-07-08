  <template>
  <v-card v-if="showPage" class="mx-auto" max-width="80%" min-height="600px">
    <v-card-title class="text-start text-wrap" style="text-transform: none">{{
      event.title
    }}</v-card-title>
    <v-row v-if="User && User.id === event.user_id" class="pt-4 pl-10">
      <v-btn
        style="text-transform: none"
        color="primary"
        class="pb-0 white--text"
        @click.stop="editEvent(event.slug)"
        >Chỉnh sửa sự kiện</v-btn
      >
      <v-dialog v-model="dialogDelete" max-width="400px">
        <v-card>
          <v-card-title class="text-h8 red--text text-center"
            >Bạn chắc chắn muốn sự kiện viết này?</v-card-title
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
        >Xóa sự kiện</v-btn
      >
      <v-btn
        style="text-transform: none"
        color="#F06292"
        class="pb-0 white--text ml-4"
        @click.stop="volunteerList(event.id)"
        >Quản lý danh sách tham gia</v-btn
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
          @click.stop="viewUser(event.user.url_account)"
          >{{ event.user.name }}</v-btn
        ></v-card-subtitle
      >
      <v-spacer></v-spacer>
      <v-card-subtitle class="pb-2 pt-1"
        >Chỉnh sửa lần cuối lúc:
        {{ event.updated_at.substring(0, 10) }}</v-card-subtitle
      >
    </v-row>
    <v-row class="pb-5 pl-4">
      <v-chip class="ma-2" color="primary">
        Thể loại: {{ event.category.name }}
      </v-chip>

      <v-chip class="ma-2" color="red" text-color="white">
        Deadline : {{ event.deadline.substring(0, 10) }}
      </v-chip>

      <v-chip
        class="ma-2"
        :color="event.status ? 'green' : 'close'"
        text-color="white"
      >
        Trạng thái: {{ event.status ? "Mở" : "Đóng" }}
      </v-chip>
    </v-row>
    <v-divider></v-divider>
    <div
      style="divcontent"
      class="text-align: none pa-4"
      v-html="this.event.content"
    ></div>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="User && !checkRegister()"
        color="green"
        class="white--text"
        :disabled="!enableRegister"
        @click="registerEvent()"
        >ĐĂNG KÝ
      </v-btn>
      <v-btn
        v-if="User && checkRegister()"
        color="red"
        class="white--text"
        @click="cancelRegisterEvent()"
        >HỦY ĐĂNG KÝ
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import AdminApis from "@/factories/admin";
import { mapGetters } from "vuex";
import EventApis from "../../factories/event";
export default {
  data: () => ({
    event: {},
    showPage: false,
    dialogDelete: false,
  }),
  created() {
    this.getEventDetail(this.$route.params.slug);
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
    enableRegister() {
      if (this.event.status && this.User.role === "volunteer") {
        return true;
      } else return false;
    },
  },

  methods: {
    checkRegister() {
      if (
        this.event.register_list.find(({ user_id }) => user_id === this.User.id)
      ) {
        return true;
      } else {
        return false;
      }
    },
    getEventDetail(slug) {
      this.showLoadingOverlay();
      EventApis.getEventDetail(slug)
        .then((value) => {
          this.event = value;
          this.showPage = true;
        })
        .catch(() => {});
      this.hideLoadingOverlay();
    },
    viewUser(url) {
      return this.$router.push({ path: "/user/" + url });
    },
    editEvent(slug) {
      return this.$router.push({ path: "/event/" + slug + "/edit" });
    },
    volunteerList(id) {
      return this.$router.push({ path: "/event/" + id + "/volunteer" });
    },
    deleteItemConfirm() {
      AdminApis.deleteEvent(this.event.id)
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
    registerEvent() {
      const eventInfo = {
        event_id: this.event.id,
      };
      EventApis.registerEvent(eventInfo)
        .then(() => {
          this.successAlert("Đăng ký thành công");
          this.$router.go();
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi! Thử lại");
        });
    },
    cancelRegisterEvent() {
      EventApis.cancelRegisterEvent(this.event.id)
        .then(() => {
          this.successAlert("Hủy đăng ký thành công");
          this.$router.go();
        })
        .catch(() => {
          this.errorAlert("Đã xảy ra lỗi! Thử lại");
        });
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
