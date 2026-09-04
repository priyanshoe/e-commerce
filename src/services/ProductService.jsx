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

async function getProductsByBusinesse(id) {
    try {
        const result = await axios.get(`${url}/products?businessId=${id}`);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function save(data) {
    try {
        const result = await axios.post(url + "/products", data);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function update(id, data) {
    try {
        const result = await axios.patch(url + "/products/" + id, data);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function deleteItem(id) {
    try {
        const result = await axios.delete(url + "/products/" + id);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}




export default { getProducts, getProduct, getProductsByBusinesse, save, update, deleteItem }