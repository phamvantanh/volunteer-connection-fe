import axios from 'axios';
const baseUrl = process.env.VUE_APP_BASE_URL
const UserApis = {

    GET_USER_BY_URL: `${baseUrl}/user`,

    CHANGE_PASS: `${baseUrl}/change-pass`,

    getUserProfile(url) {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_USER_BY_URL + `/${url}`)
                .then((value) => {
                    resolve(value.data.user);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },
    changePass(data) {
        return new Promise((resolve, reject) => {
            axios.post(this.CHANGE_PASS, data)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

}
export default UserApis
