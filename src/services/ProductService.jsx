import axios from "axios";

const url = import.meta.env.VITE_API_URL;

async function getProducts() {
    try {
        const result = await axios.get(url + "/products")
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}


async function getProduct(id) {
    try {
        const result = await axios.get(url + "/products/" + id)
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function getProductsByBusiness(id) {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(`${url}/business/${id}/products`, { headers: { Authorization: 'Bearer ' + token } });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function save(data) {
    try {
        const token = localStorage.getItem("token");
        const id = data.businessId;
        // console.log(data.businessId);

        const result = await axios.post(`${url}/business/${id}/product`, data, { headers: { Authorization: 'Bearer ' + token } });
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function update(id, data) {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.patch(url + "/products/" + id, data, { headers: { Authorization: 'Bearer ' + token } });
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function deleteItem(id) {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.delete(url + "/products/" + id, { headers: { Authorization: 'Bearer ' + token } });
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}




export default { getProducts, getProduct, getProductsByBusiness, save, update, deleteItem }