import api from "./axios";

export const getBooks = (params = { skip: 0, limit: 100 }) =>
    api.get("/books/", { params });

export const getBookById = (id) => api.get(`/books/${id}`);

export const createBook = (data) => api.post("/books/create", data);

export const updateBook = (id, data) => api.put(`/books/${id}`, data);

export const deleteBook = (id) => api.delete(`/books/${id}`);

export const searchBooks = async (query) => {
    const { data } = await getBooks();
    return data.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.category.toLowerCase().includes(query.toLowerCase())
    );
};
