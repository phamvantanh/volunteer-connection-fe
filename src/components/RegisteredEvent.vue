<template>
  <v-row dense class="mb-5 mt-5">
    <v-col v-for="event in events" :key="event.id" cols="4">
      <v-card @click="viewEvent(event.slug)" height="500px">
        <v-img
          :src="event.event_thumbnail"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="200px"
        >
        </v-img>
        <v-row class="mt-1">
          <v-col cols="12" sm="12" class="pa-0">
            <v-card-subtitle
              class="text-h6 green--text pb-2 pr-0"
              width="50%"
              v-text="event.title"
            ></v-card-subtitle>
          </v-col>
        </v-row>
        <v-row>
          <v-chip class="ml-4 mb-2" color="primary">
            Thể loại: {{ event.category.name }}
          </v-chip>
        </v-row>
        <v-row>
          <v-chip class="ml-4 mb-2" color="red" text-color="white">
            Deadline : {{ event.deadline.substring(0, 10) }}
          </v-chip>
          <v-chip
            class="ml-4"
            :color="event.status ? 'green' : 'close'"
            text-color="white"
          >
            Trạng thái: {{ event.status ? "Mở" : "Đóng" }}
          </v-chip>
        </v-row>
        <v-row class="pt-1">
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
          <v-card-subtitle class="pb-2 pt-1"
            >Chỉnh sửa lần cuối lúc:
            {{ event.updated_at ? event.updated_at.substring(0, 10) : "" }}
          </v-card-subtitle>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import EventApis from "@/factories/event";
export default {
  name: "registered-event",
  data: () => ({
    events: [],
  }),
  props: {
    id: String,
  },
  created() {
    EventApis.getRegisteredEvent(this.id)
      .then((value) => {
        this.events = value.filter((event) => event.is_published === 1);
      })
      .catch(() => {});
  },
  methods: {
    viewEvent(slug) {
      return this.$router.push({ path: "/event/" + slug });
    },
    viewUser(url) {
      return this.$router.push({ path: "/user/" + url });
    },
  },
};
</script>

<style scoped>
</style>
