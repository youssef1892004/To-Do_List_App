import React, { useState } from 'react';
import { Check, Trash2, Edit, Calendar, Flag } from 'lucide-react';

interface TodoItemProps {
  todo: {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate: string | null;
  };
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: { title: string; description: string; priority: 'low' | 'medium' | 'high'; dueDate: string | null }) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [priority, setPriority] = useState(todo.priority);
  const [dueDate, setDueDate] = useState(todo.dueDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(todo._id, { title, description, priority, dueDate });
    setIsEditing(false);
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 ${
      todo.completed 
        ? 'border-green-500 opacity-75' 
        : todo.priority === 'high' 
          ? 'border-red-500' 
          : todo.priority === 'medium' 
            ? 'border-yellow-500' 
            : 'border-green-500'
    }`}>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setDueDate(e.target.value || null)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <button
                onClick={() => onToggleComplete(todo._id)}
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border ${
                  todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                } flex items-center justify-center`}
              >
                {todo.completed && <Check size={14} className="text-white" />}
              </button>
              
              <div className="flex-1">
                <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {todo.title}
                </h3>
                
                {todo.description && (
                  <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    {todo.description}
                  </p>
                )}
                
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[todo.priority]}`}>
                    <Flag size={12} className="mr-1" />
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                  
                  {todo.dueDate && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(todo.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Edit todo"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(todo._id)}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                aria-label="Delete todo"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;