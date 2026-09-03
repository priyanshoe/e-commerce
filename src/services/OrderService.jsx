
import axios from "axios";
const url = import.meta.env.VITE_API_URL;

async function getOrderByUser(id) {
    try {
        const result = await axios.get(`${url}/orders?customerId=${id}`);
        console.log("working");

        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function getOrders() {
    try {
        const result = await axios.get(url + "/orders");
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function getOrder(id) {
    try {
        const result = await axios.get(url + "/orders/" + id);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function save(data) {
    try {
        const result = await axios.post(url + "/orders", data);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function update(id, quantity) {
    try {
        const result = await axios.patch(url + "/orders/" + id, { quantity: quantity });
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function deleteItem(id) {
    try {
        const result = await axios.delete(url + "/orders/" + id);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}



export default { getOrderByUser, getOrders, getOrder, save, update, deleteItem }