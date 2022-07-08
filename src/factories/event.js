import axios from 'axios';
const baseUrl = process.env.VUE_APP_BASE_URL
const EventApis = {

    GET_EVENT_BY_SLUG: `${baseUrl}/events`,

    SEARCH_EVENT: `${baseUrl}/events/search`,

    GET_EVENT_CATEGORY: `${baseUrl}/categories`,

    ADD_NEW_EVENT: `${baseUrl}/event`,

    REGISTER_EVENT: `${baseUrl}/register/event`,

    GET_VOLUNTEER_LIST: `${baseUrl}/register-list`,

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
        console.log(data)
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

}
export default EventApis
