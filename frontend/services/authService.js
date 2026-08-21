import api from "./api";

export async function register(username, email, password) {
    try {
        const response = await api.post("/api/auth/register", {
            username,
            email,
            password,
        });

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Registration failed."
        );
    }
}

export async function login(identifier, password) {
    try {
        const response = await api.post("/api/auth/login", {
            identifier,
            password,
        });

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Login failed."
        );
    }
}