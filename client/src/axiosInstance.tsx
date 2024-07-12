import axios from "axios";

export const axiosApi = axios.create({
    baseURL: `https://${window.location.hostname}/api/`,
    timeout: 1000
});

axiosApi.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    const originalRequest = error.config;
    if (error.response.status != 401 && !originalRequest._retry) {
        return Promise.reject(error);
    }
    const isSuccesfull=await Refresh()

    if(!isSuccesfull){
        localStorage.clear()
        window.location.reload()
    }

    return axiosApi(originalRequest)
});

async function Refresh() {
    const response = await axiosApi.post(`auth/refresh`, {}, {
        withCredentials: true
    })
    if (response.status != 200) {
        return false
    }
    const data = response.data
    const expiredDate = new Date()
    expiredDate.setSeconds(expiredDate.getSeconds() + data.expires_in)
    localStorage.setItem("id_token", data.id_token)
    localStorage.setItem("email", data.email)
    localStorage.setItem("expires_in", expiredDate.toString())
    localStorage.setItem("photo_url", data.photo_url)
    return true
}