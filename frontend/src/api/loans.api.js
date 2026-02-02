// loans.api.js
import api from "./axios";

export const myLoans = () => api.get("/loans/my-loans");

export const borrowBook = (bookId, days = 14) =>
  api.post(`/loans/borrow/${bookId}`, null, { params: { days } });

export const returnBook = (loanId) => api.post(`/loans/return/${loanId}`);

export const allLoans = () => api.get("/loans/all");

// Ajouts pour l'admin
export const createLoan = (data) => api.post("/loans", data);

// CHANGEMENT IMPORTANT : on passe de patch → put
// (c'est la cause la plus probable du 405)
export const updateLoan = (loanId, data) => api.put(`/loans/${loanId}`, data);

// Pour remplir les selects dans le modal
export const getBooks = () => api.get("/books");     // ou "/books/all" selon ton API
export const getUsers = () => api.get("/users");     // ou "/users/all"