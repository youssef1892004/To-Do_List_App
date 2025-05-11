import React, { useContext, useState, useEffect } from 'react';
import { TodoContext } from '../context/TodoContext';
import { AuthContext } from '../context/AuthContext';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import { ListFilter, CheckSquare, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { todos, loading, error, addTodo, updateTodo, deleteTodo } = useContext(TodoContext);
  
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  
  const handleAddTodo = async (todo: { title: string; description: string; priority: 'low' | 'medium' | 'high'; dueDate: string | null }) => {
    await addTodo(todo);
  };
  
  const handleToggleComplete = async (id: string) => {
    const todo = todos.find(t => t._id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
    }
  };
  
  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
  };
  
  const handleEditTodo = async (id: string, updates: { title: string; description: string; priority: 'low' | 'medium' | 'high'; dueDate: string | null }) => {
    await updateTodo(id, updates);
  };
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      return (priorityValues[b.priority] || 0) - (priorityValues[a.priority] || 0);
    }
  });
  
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  
  if (loading && todos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.username}!</h1>
        <p className="text-gray-600 mt-2">Manage your tasks efficiently</p>
      </div>
      
      <TodoForm onAddTodo={handleAddTodo} />
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <AlertCircle className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <CheckSquare className="mr-2 text-blue-600" />
            <span className="text-lg font-medium">
              {activeTodosCount} active task{activeTodosCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <ListFilter size={18} className="mr-1 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="flex items-center ml-2">
              <span className="text-gray-500 text-sm mr-1">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-sm"
              >
                <option value="date">Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {sortedTodos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 mb-4">
            <CheckSquare size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            {filter === 'all'
              ? "You don't have any tasks yet. Add one above!"
              : filter === 'active'
              ? "You don't have any active tasks. Great job!"
              : "You don't have any completed tasks yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
              onEdit={handleEditTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;