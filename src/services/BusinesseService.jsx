import axios from "axios";

const url = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('token');

async function getMyBusinesses() {
    try {
        const result = await axios.get(`${url}/business`, { headers: { Authorization: 'Bearer ' + token } });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.response.data.message };
    }
}

// async function getBusinesses() {
//     try {
//         const result = await axios.get(url + "/businesses")
//         return { success: true, status: 200, data: result.data };
//     } catch (error) {
//         throw { success: false, status: error.status || 500, error: error.message };
//     }
// }

async function getBusinessById(id) {
    try {
        const result = await axios.get(url + "/business/" + id)
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function save(data) {
    try {
        const result = await axios.post(url + "/business", data, {
            headers: { Authorization: 'Bearer ' + token }
        });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function update(id, data) {
    try {
        const result = await axios.patch(url + "/business/" + id, data);
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function deleteItem(id) {
    try {
        const result = await axios.delete(url + "/business/" + id);
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

export default { getMyBusinesses, getBusinessById, save, update, deleteItem }