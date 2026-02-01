import api from "./axios";

export const getUsers = (params = { skip: 0, limit: 100 }) =>
  api.get("/users/", { params });

export const getUserById = (id) => api.get(`/users/${id}`);

export const createUser = (data) => api.post("/users/", data);

export const updateUser = (id, data) => api.put(`/users/${id}`, data);

export const updateUserRole = (id, role) =>
  api.put(`/users/${id}/role`, null, { params: { role } });

export const activateUser = (id) => api.put(`/users/${id}/activate`);

export const deactivateUser = (id) => api.put(`/users/${id}/deactivate`);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const searchUsers = async (query) => {
  const { data } = await getUsers();
  return data.filter(user =>
    user.username.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase())
  );
};
