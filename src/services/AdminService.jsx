import axios from "axios";

const url = import.meta.env.VITE_API_URL;


const getDashboard = async () => {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(url + "/admin/dashboard", { headers: { Authorization: "Bearer " + token } });
        return { success: true, status: 200, data: result.data?.data };

    } catch (error) {
        console.log("Error in fetching admin dashboard", err)
        throw { success: false, status: err.status || 500, error: err.response.data.message };

    }
}


async function getUsers() {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(url + "/admin/users", { headers: { Authorization: "Bearer " + token } });
        return { success: true, status: 200, data: result.data?.data };
    } catch (err) {
        console.log("Error in fetching users", err)
        throw { success: false, status: err.status || 500, error: err.response.data.message };
    }
}

const getBusinesses = async () => {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(url + "/admin/businesses", { headers: { Authorization: "Bearer " + token } });
        return { success: true, status: 200, data: result.data?.data };

    } catch (error) {
        console.log("Error in fetching businesses", err)
        throw { success: false, status: err.status || 500, error: err.response.data.message };

    }
}


const getProducts = async () => {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(url + "/admin/products", { headers: { Authorization: "Bearer " + token } });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        console.log("Error in fetching products", err)
        throw { success: false, status: err.status || 500, error: err.response.data.message };

    }
}


const getOrders = async () => {
    try {
        const token = localStorage.getItem("token");
        const result = await axios.get(url + "/admin/orders", { headers: { Authorization: "Bearer " + token } });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        console.log("Error in fetching products", err)
        throw { success: false, status: err.status || 500, error: err.response.data.message };

    }
}


export default { getDashboard, getUsers, getBusinesses, getProducts, getOrders }