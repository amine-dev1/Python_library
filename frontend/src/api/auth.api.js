import api from "./axios";

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const me = () => api.get("/auth/me");
export const changePassword = (data) => api.post("/auth/change-password", data);
export const refreshToken = () => api.post("/auth/refresh");
