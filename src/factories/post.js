import axios from 'axios';
const baseUrl = process.env.VUE_APP_BASE_URL
const PostApis = {

    GET_POST_BY_SLUG: `${baseUrl}/posts`,

    SEARCH_POST: `${baseUrl}/posts/search`,

    ADD_POST: `${baseUrl}/post`,

    REPORT_POST: `${baseUrl}/reports`,

    getPostDetail(slug) {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_POST_BY_SLUG + `/${slug}`)
                .then((value) => {
                    resolve(value.data.post);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    getPostSearch(params) {
        return new Promise((resolve, reject) => {
            axios.get(this.SEARCH_POST + `/${params}`)
                .then((value) => {
                    resolve(value.data.posts);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    editPost(post) {
        return new Promise((resolve, reject) => {
            axios.put(this.ADD_POST+ `/${post.id}`, post)
                .then((value) => {
                    resolve(value.data.post);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    addPost(post) {
        return new Promise((resolve, reject) => {
            axios.post(this.ADD_POST, post)
                .then((value) => {
                    resolve(value.data.post);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    report(post) {
        return new Promise((resolve, reject) => {
            axios.post(this.REPORT_POST, post)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

}
export default PostApis
