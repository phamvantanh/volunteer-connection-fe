import axios from 'axios';
const baseUrl = process.env.VUE_APP_BASE_URL
const HomeApis = {

    GET_POSTS: `${baseUrl}/homepage/posts`,

    GET_EVENTS: `${baseUrl}/homepage/events`,

    BOOKMARK: `${baseUrl}/bookmarked`,

    getPosts(page) {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_POSTS + `?page=${page}`)
                .then((value) => {
                    resolve(value.data.post);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    getEvents(page) {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_EVENTS + `?page=${page}`)
                .then((value) => {
                    resolve(value.data.event);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    getPostsBookmarked() {
        return new Promise((resolve, reject) => {
            axios.get(this.BOOKMARK + `/posts`)
                .then((value) => {
                    resolve(value.data.bookmarkedPost);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    getEventsBookmarked() {
        return new Promise((resolve, reject) => {
            axios.get(this.BOOKMARK + `/events`)
                .then((value) => {
                    resolve(value.data.bookmarkedEvent);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    bookmarkPost(id) {
        const post = {
            'post_id': id
        }
        return new Promise((resolve, reject) => {
            axios.post(this.BOOKMARK + `/post`, post)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    unBookmarkPost(id) {
        return new Promise((resolve, reject) => {
            axios.delete(this.BOOKMARK + `/post/${id}`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    bookmarkEvent(id) {
        const event = {
            'event_id': id
        }
        return new Promise((resolve, reject) => {
            axios.post(this.BOOKMARK + `/event`, event)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    unBookmarkEvent(id) {
        return new Promise((resolve, reject) => {
            axios.delete(this.BOOKMARK + `/event/${id}`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

}
export default HomeApis
