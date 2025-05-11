import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TodoInput {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string | null;
}

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  getTodos: () => Promise<void>;
  addTodo: (todo: TodoInput) => Promise<void>;
  updateTodo: (id: string, todo: Partial<TodoInput> & { completed?: boolean }) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearError: () => void;
}

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  loading: false,
  error: null,
  getTodos: async () => {},
  addTodo: async () => {},
  updateTodo: async () => {},
  deleteTodo: async () => {},
  clearError: () => {},
});

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Get todos when user changes
  useEffect(() => {
    if (user) {
      getTodos();
    } else {
      setTodos([]);
    }
  }, [user]);

  // Get all todos
  const getTodos = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/todos`);
      setTodos(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  // Add todo
  const addTodo = async (todo: TodoInput) => {
    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/todos`, todo);
      setTodos([res.data, ...todos]);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  // Update todo
  const updateTodo = async (id: string, todo: Partial<TodoInput> & { completed?: boolean }) => {
    try {
      setLoading(true);
      const res = await axios.put(`${apiUrl}/todos/${id}`, todo);
      setTodos(todos.map(t => (t._id === id ? res.data : t)));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        getTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        clearError,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};