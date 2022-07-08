import axios from 'axios';
const baseUrl = process.env.VUE_APP_BASE_URL
const AdminApis = {

    GET_DASHBOARD_INFO: `${baseUrl}/admin`,

    GET_ALL_USER: `${baseUrl}/users`,

    USER_ACTION: `${baseUrl}/user`,

    GET_ALL_POST: `${baseUrl}/posts`,

    DELETE_POST: `${baseUrl}/post`,

    CATEGORY: `${baseUrl}/categories`,

    GET_ALL_EVENT: `${baseUrl}/events`,

    DELETE_EVENT: `${baseUrl}/event`,

    REPORT: `${baseUrl}/reports`,

    getDashBoardInfo() {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_DASHBOARD_INFO)
                .then((value) => {
                    resolve(value.data);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    getUserList() {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_ALL_USER)
                .then((value) => {
                    resolve(value.data.users);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    deleteUser(id) {
        return new Promise((resolve, reject) => {
            axios.delete(this.USER_ACTION + `/${id}`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    updateUser(userInfo) {
        return new Promise((resolve, reject) => {
            axios.put(this.USER_ACTION + `/${userInfo.id}`, userInfo)
                .then((value) => {
                    resolve(value);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    addUser(userInfo) {
        return new Promise((resolve, reject) => {
            axios.post(this.USER_ACTION, userInfo)
                .then((value) => {
                    resolve(value);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    getPostList() {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_ALL_POST)
                .then((value) => {
                    resolve(value.data.posts);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    deletePost(id) {
        return new Promise((resolve, reject) => {
            axios.delete(this.DELETE_POST + `/${id}`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    getAllCategory() {
        return new Promise((resolve, reject) => {
            axios.get(this.CATEGORY)
                .then((value) => {
                    resolve(value.data.categories);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    updateCategory(category) {
        return new Promise((resolve, reject) => {
            axios.put(this.CATEGORY + `/${category.id}`, category)
                .then((value) => {
                    resolve(value);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    deleteCategory(id) {
        return new Promise((resolve, reject) => {
            axios.delete(this.CATEGORY + `/${id}`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    addCategory(info) {
        return new Promise((resolve, reject) => {
            axios.post(this.CATEGORY, info)
                .then((value) => {
                    resolve(value);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    getEventList() {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_ALL_EVENT)
                .then((value) => {
                    resolve(value.data.events);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    deleteEvent(id) {
        return new Promise((resolve, reject) => {
            axios.delete(this.DELETE_EVENT + `/${id}`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    getReportList() {
        return new Promise((resolve, reject) => {
            axios.get(this.REPORT)
                .then((value) => {
                    resolve(value.data.postReports);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    deleteReport(id) {
        return new Promise((resolve, reject) => {
            axios.delete(this.REPORT + `/${id}`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    updateReport(info) {
        return new Promise((resolve, reject) => {
            axios.put(this.REPORT + `/${info.id}`, info)
                .then((value) => {
                    resolve(value);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

}
export default AdminApis
