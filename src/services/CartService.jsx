import axios from "axios";
const url = import.meta.env.VITE_API_URL;

async function getMyCart() {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(`${url}/cart`, { headers: { Authorization: "Bearer " + token } });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error?.response?.data?.message };
    }
}

async function getCart() {
    try {
        const result = await axios.get(url + "/cart");
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error?.response?.data?.message };
    }
}

async function save(data) {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.post(url + "/cart", data, { headers: { Authorization: "Bearer " + token } });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error?.response?.data?.message };
    }
}

async function update(id, quantity) {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.patch(url + "/cart/" + id, quantity,
            {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error?.response?.data?.message };
    }
}

async function deleteItem(id) {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.delete(url + "/cart/" + id, { headers: { Authorization: "Bearer " + token } });
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error?.response?.data?.message };
    }
}

async function deleteAll(id) {
    try {
        const result = await axios.delete(url + "/cartItems/" + id);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}


export default { getMyCart, getCart, save, update, deleteItem }