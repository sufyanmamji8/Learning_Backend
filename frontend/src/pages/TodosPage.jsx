import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as todosApi from '../api/todos';
import { CheckSquare, Plus, Trash2, Edit2, LogOut, Check, X, Calendar, Clock } from 'lucide-react';

const TodosPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data } = await todosApi.getTodos();
      setTodos(data.todos || []);
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const { data } = await todosApi.createTodo(formData.title, formData.description);
      setTodos([data.todo, ...todos]);
      setFormData({ title: '', description: '' });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to create todo');
    }
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const { data } = await todosApi.updateTodo(editingTodo._id, formData);
      setTodos(todos.map(todo => 
        todo._id === editingTodo._id ? data.todo : todo
      ));
      setEditingTodo(null);
      setFormData({ title: '', description: '' });
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todosApi.deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const { data } = await todosApi.updateTodo(todo._id, { completed: !todo.completed });
      setTodos(todos.map(t => t._id === todo._id ? data.todo : t));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const startEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({ title: todo.title, description: todo.description || '' });
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setFormData({ title: '', description: '' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Todos</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Add Todo Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-violet-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Todo</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Add/Edit Todo Form */}
        {(showAddForm || editingTodo) && (
          <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">
              {editingTodo ? 'Edit Todo' : 'Add New Todo'}
            </h3>
            <form onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Todo title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white text-gray-900"
                  autoFocus
                />
              </div>
              <div>
                <textarea
                  placeholder="Description (optional)..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white text-gray-900 resize-none"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-colors"
                >
                  {editingTodo ? 'Update' : 'Add'} Todo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    cancelEdit();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Todos List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <CheckSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
              <p className="text-gray-500">Create your first todo to get started!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className={`p-6 bg-white rounded-2xl shadow-lg border transition-all ${
                  todo.completed 
                    ? 'border-gray-200 opacity-75' 
                    : 'border-gray-100 hover:shadow-xl'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => handleToggleComplete(todo)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-violet-500'
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${
                      todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`mt-1 ${
                        todo.completed ? 'text-gray-400 line-through' : 'text-gray-600'
                      }`}>
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
                      </div>
                      {todo.updatedAt !== todo.createdAt && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Updated</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEdit(todo)}
                      className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default TodosPage;
