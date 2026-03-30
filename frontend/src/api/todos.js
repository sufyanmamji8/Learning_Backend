import api from './axios';

export const getTodos = () =>
  api.get('/todos');

export const createTodo = (title, description) =>
  api.post('/todos', { title, description });

export const updateTodo = (id, data) =>
  api.put(`/todos/${id}`, data);

export const deleteTodo = (id) =>
  api.delete(`/todos/${id}`);
