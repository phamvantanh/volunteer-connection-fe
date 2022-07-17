import axios from 'axios';
const baseUrl = process.env.VUE_APP_BASE_URL
const EventApis = {

    GET_EVENT_BY_SLUG: `${baseUrl}/events`,

    SEARCH_EVENT: `${baseUrl}/events/search`,

    GET_EVENT_CATEGORY: `${baseUrl}/categories`,

    ADD_NEW_EVENT: `${baseUrl}/event`,

    REGISTER_EVENT: `${baseUrl}/register/event`,

    GET_VOLUNTEER_LIST: `${baseUrl}/register-list`,

    GET_EVENT_PROFILE: `${baseUrl}/user`,

    GET_COMMENTS: `${baseUrl}/event`,

    ADD_COMMENTS: `${baseUrl}/comments`,

    REVIEWS: `${baseUrl}/reviews`,

    GET_REVIEWS: `${baseUrl}/event`,




    getEventDetail(slug) {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_EVENT_BY_SLUG + `/${slug}`)
                .then((value) => {
                    resolve(value.data.event);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    getEventSearch(params) {
        return new Promise((resolve, reject) => {
            axios.get(this.SEARCH_EVENT + `/${params}`)
                .then((value) => {
                    resolve(value.data.events);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    getCategory() {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_EVENT_CATEGORY)
                .then((value) => {
                    resolve(value.data.categories);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    addEvent(event) {
        return new Promise((resolve, reject) => {
            axios.post(this.ADD_NEW_EVENT, event)
                .then((value) => {
                    resolve(value.data.event);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    editEvent(event) {
        return new Promise((resolve, reject) => {
            axios.put(this.ADD_NEW_EVENT + `/${event.id}`, event)
                .then((value) => {
                    resolve(value.data.event);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    registerEvent(event) {
        return new Promise((resolve, reject) => {
            axios.post(this.REGISTER_EVENT, event)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    cancelRegisterEvent(id) {
        return new Promise((resolve, reject) => {
            axios.delete(this.REGISTER_EVENT + `/${id}`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    getUserListOfEvent(id) {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_VOLUNTEER_LIST + `/${id}`)
                .then((value) => {
                    resolve(value.data.user_list);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    removeVolunteer(data) {
        return new Promise((resolve, reject) => {
            axios.post(this.GET_VOLUNTEER_LIST + `/delete`, data)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    updateVolunteer(data) {
        console.log(data)
        return new Promise((resolve, reject) => {
            axios.put(this.GET_VOLUNTEER_LIST + `/update`, data)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    getMyEvent(id) {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_EVENT_PROFILE + `/${id}/` + 'event')
                .then((value) => {
                    resolve(value.data.events);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    getRegisteredEvent(id) {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_EVENT_PROFILE + `/${id}/` + 'register-event')
                .then((value) => {
                    resolve(value.data.events);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    getCommentEvent(id) {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_COMMENTS + `/${id}/` + 'comments')
                .then((value) => {
                    resolve(value.data.comments);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    addComment(data) {
        return new Promise((resolve, reject) => {
            axios.post(this.ADD_COMMENTS, data)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    deleteComment(id) {
        return new Promise((resolve, reject) => {
            axios.delete(this.ADD_COMMENTS + `/${id}`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    updateComment(data) {
        return new Promise((resolve, reject) => {
            axios.put(this.ADD_COMMENTS + `/${data.id}`, data)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },


    getReviewEvent(id) {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_REVIEWS + `/${id}/` + 'reviews')
                .then((value) => {
                    resolve(value.data.reviews);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    addReview(data) {
        return new Promise((resolve, reject) => {
            axios.post(this.REVIEWS, data)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    deleteReview(id) {
        return new Promise((resolve, reject) => {
            axios.delete(this.REVIEWS + `/${id}`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    updateReview(data) {
        return new Promise((resolve, reject) => {
            axios.put(this.REVIEWS + `/${data.id}`, data)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

}
export default EventApis
