import axios from "axios";

const url = import.meta.env.VITE_API_URL;

async function getBusinessesByUser(id) {
    try {
        const result = await axios.get(`${url}/businesses?sellerId=${id}`);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function getBusinesses() {
    try {
        const result = await axios.get(url + "/businesses")
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}
async function getBusinessById(id) {
    try {
        const result = await axios.get(url + "/businesses/" + id)
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function save(data) {
    try {
        const result = await axios.post(url + "/businesses", data);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function update(id, data) {
    try {
        const result = await axios.patch(url + "/businesses/" + id, data);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function deleteItem(id) {
    try {
        const result = await axios.delete(url + "/businesses/" + id);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

export default { getBusinesses, getBusinessById, getBusinessesByUser, save, update, deleteItem }