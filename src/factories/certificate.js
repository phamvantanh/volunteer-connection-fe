import axios from 'axios';
const baseUrl = process.env.VUE_APP_BASE_URL
const CertificateApis = {

    GET_MY_CERTIFICATE: `${baseUrl}/user`,

    ACTION_CERTIFICATE: `${baseUrl}/certificates`,

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

    addNewCertificate(data) {
        return new Promise((resolve, reject) => {
            axios.post(this.ACTION_CERTIFICATE, data)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    deleteCertificate(id) {
        return new Promise((resolve, reject) => {
            axios.delete(this.ACTION_CERTIFICATE + `/${id}`)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    updateCertificate(data) {
        return new Promise((resolve, reject) => {
            axios.put(this.ACTION_CERTIFICATE + `/${data.id}`, data)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }


}
export default CertificateApis
