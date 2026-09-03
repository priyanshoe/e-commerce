import axios from "axios";

const url = import.meta.env.VITE_API_URL;

async function getBusinesses() {
    try {
        const result = await axios.get(url + "/businesses")
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}


async function getBusinesse(id) {
    try {
        const result = await axios.get(url + "/businesses/" + id);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

export default { getBusinesses, }