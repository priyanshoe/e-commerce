import axios from "axios";

const url = import.meta.env.VITE_API_URL;

const register = async (data) => {
    try {
        const result = await axios.post(url + "/auth/register", data)
        return { success: true, status: 200, data: result.data };
    } catch (err) {
        console.log("Error in registration", err)
        throw { success: false, status: err.status || 500, error: err.response.data.message };
    }
}

async function login(data) {
    try {
        const result = await axios.post(url + "/auth/login", data)
        return { success: true, status: 200, data: result.data };
    } catch (err) {
        console.log("Error in login", err.response)
        return { success: false, status: err.status || 500, error: err.response.data.message };
    }
}

async function authMe() {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(url + "/auth/me", {
            headers: { Authorization: 'Bearer ' + token }
        });
        return { success: true, status: 200, data: result.data?.data };
    } catch (err) {
        console.log("Error in auth", err.response)
        return { success: false, status: err.status || 500, error: err.response.data.message };
    }
}




export default { register, login, authMe }