import axios from 'axios';
const baseUrl = process.env.VUE_APP_BASE_URL
const PostApis = {

    GET_USER_BY_URL: `${baseUrl}/user`,

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

}
export default PostApis
