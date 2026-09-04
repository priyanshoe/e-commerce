import axios from "axios";

const url = import.meta.env.VITE_API_URL;

const findByEmail = async (email) => {
    try {
        const result = await axios.get(
            `${url}/users?email=${encodeURIComponent(email)}`
        )

        return result.data[0] || null
    } catch (err) {
        console.error("Error finding user by email:", err)
        throw { success: false, status: err.status || 500, error: err.message };
    }
}

async function findAll() {
    try {
        const result = await axios.get(url + "/users")
        return { success: true, status: 200, data: result.data };
    } catch (err) {
        console.log("Error in fetching Doctors", err);
        throw { success: false, status: err.status || 500, error: err.message };
    }
}

const register = async (data) => {
    try {
        const user = await findByEmail(data?.email);
        if (user) {
            throw { status: 402, message: "user already exist" };
        }
        const result = await axios.post(url + "/users", data)
        delete result.data.password;
        return { success: true, status: 200, data: result.data };
    } catch (err) {
        console.log("Error in resigtration", err)
        throw { success: false, status: err.status || 500, error: err.message };
    }
}

async function login(email, password) {
    try {
        const user = await findByEmail(email);
        if (!user) {
            throw { status: 404, message: "user not fount" }
        }
        if (password !== user?.password) {
            throw { status: 409, message: "bad credentials" }
        }
        delete user.password;
        return { success: true, status: 200, data: user };
    } catch (err) {
        console.log("Error in login", err)
        throw { success: false, status: err.status || 500, error: err.message };

    }
}




export default { register, login, findAll, findByEmail }