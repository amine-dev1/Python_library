import api from "./axios";

export const myLoans = () => api.get("/loans/my-loans");

export const borrowBook = (bookId, days = 14) =>
    api.post(`/loans/borrow/${bookId}`, null, { params: { days } });

export const returnBook = (loanId) => api.post(`/loans/return/${loanId}`);

export const allLoans = () => api.get("/loans/all");
