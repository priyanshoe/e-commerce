import axios from "axios";

const url = import.meta.env.VITE_API_URL;

async function getMyBusinesses() {
    try {
        const token = localStorage.getItem('token');
        const result = await axios.get(`${url}/business`, { headers: { Authorization: 'Bearer ' + token } });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        console.log(error.response);

        throw { success: false, status: error.status || 500, error: error?.response?.data?.message };
    }
}

// for Admin only
// async function getBusinesses() {
//     try {
// const token = localStorage.getItem('token');
//         const result = await axios.get(url + "/businesses", {
//     headers: { Authorization: 'Bearer ' + token }
// })
//         return { success: true, status: 200, data: result.data };
//     } catch (error) {
//         throw { success: false, status: error.status || 500, error: error.message };
//     }
// }

async function getBusinessById(id) {
    try {
        const token = localStorage.getItem('token');
        const result = await axios.get(url + "/business/" + id, {
            headers: { Authorization: 'Bearer ' + token }
        })
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function save(data) {
    try {
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
        const result = await axios.put(url + "/business/" + id, data, {
            headers: { Authorization: 'Bearer ' + token }
        });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error?.response?.data?.message };
    }
}

async function deleteItem(id) {
    try {
        const token = localStorage.getItem('token');
        const result = await axios.delete(url + "/business/" + id, {
            headers: { Authorization: 'Bearer ' + token }
        });
        return { success: true, status: 200, data: result.data?.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

export default { getMyBusinesses, getBusinessById, save, update, deleteItem }