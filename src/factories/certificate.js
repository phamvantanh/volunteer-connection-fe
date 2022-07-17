import axios from 'axios';
const baseUrl = process.env.VUE_APP_BASE_URL
const CertificateApis = {

    GET_MY_CERTIFICATE: `${baseUrl}/user`,

    getMyCertificate(id) {
        return new Promise((resolve, reject) => {
            axios.get(this.GET_MY_CERTIFICATE + `/${id}` + '/certificate')
                .then((value) => {
                    resolve(value.data.certificates);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

}
export default CertificateApis
