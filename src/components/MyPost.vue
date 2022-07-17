<template>
  <v-container fluid>
    <v-row dense>
      <v-col v-for="post in posts" :key="post.id" cols="6">
        <v-card height="300px" class="mt-5" @click="viewPost(post.slug)">
          <v-row>
            <v-col cols="12" sm="4" class="ml-0 pl-3 pt-3 pl-0">
              <v-img
                :src="post.post_thumbnail"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="280px"
              >
              </v-img>
            </v-col>
            <v-col cols="12" sm="8">
              <v-row>
                <v-col cols="12" sm="11">
                  <v-card-subtitle
                    class="text-h6 green--text pb-2 pl-2"
                    width="50%"
                    v-text="post.title"
                  ></v-card-subtitle>
                </v-col>
              </v-row>
              <v-row>
                <p
                  style="
                    text-align: justify;
                    text-justify: inter-word;
                    padding-left: 20px;
                    padding-right: 20px;
                    margin-bottom: 0px;
                  "
                  v-html="truncate220(post.content)"
                ></p>
              </v-row>
              <v-row>
                <v-card-subtitle class="pb-2 pt-1"
                  >Chỉnh sửa lần cuối lúc:
                  {{ post.updated_at.substring(0, 10) }}</v-card-subtitle
                >
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PostApis from "@/factories/post";
export default {
  name: "my-post",
  data: () => ({
    posts: [],
  }),
  props: {
    id: String,
  },
  created() {
    PostApis.getMyPost(this.id)
      .then((value) => {
        this.posts = value;
      })
      .catch(() => {});
  },
  methods: {
    viewPost(slug) {
      return this.$router.push({ path: "/post/" + slug });
    },
  },
};
</script>

<style scoped>
</style>
