
import axios from "axios";
const url = import.meta.env.VITE_API_URL;

async function getOrderByUser() {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(url + "/order", { headers: { Authorization: "Bearer " + token } });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function getOrderBySeller() {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(`${url}/order/seller`, { headers: { Authorization: "Bearer " + token } });
        // const sellerOrders = result.data.filter(order =>
        //     order.products.some(
        //         product => String(product.businessId) === String(businessId)
        //     ));
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function getOrders() {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(url + "/order", { headers: { Authorization: "Bearer " + token } });
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}


async function save(data) {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.post(url + "/order", data, { headers: { Authorization: "Bearer " + token } });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}


async function getOrder(id) {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(url + "/order/" + id, { headers: { Authorization: "Bearer " + token } })
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}
async function update(id, status) {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.patch(url + "/order/" + id, status, {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            }
        });


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



export default { getOrderByUser, getOrderBySeller, getOrders, getOrder, save, update, deleteItem }