import _ from 'lodash';

export const rules = {
    email: [
        (v) => !!v || "Hãy nhập mục này *",
        (v) => /.+@.+/.test(v) || "Email không hợp lệ",
    ],
    name: [
        (v) => !!v || "Hãy nhập mục này *",
        (v) =>
            !_.startsWith(v, " ") || "Không chứa kí tự trống đầu tiên",
    ],
    date: [(v) => !!v || "Hãy nhập mục này *"],
    gender: [(v) => !!v || "Hãy nhập mục này *"],
    role: [(v) => !!v || "Hãy nhập mục này *"],
    phone: [
        (v) => !!v || "Hãy nhập mục này *",
        (v) =>
            _.size(v) == 10 || "Số điện thoại phải là 10 số",
        (v) => /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(v) || "Số điện thoại không hợp lệ",
    ],
    password: [
        (v) => !!v || "Hãy nhập mục này *",
        (v) =>
            _.size(v) >= 6 || "Mật khẩu phải lớn hơn hoặc bằng 6 kí tự",
    ],
    title: [
        (v) => !!v || "Hãy nhập mục này *",
    ]
}

export default rules