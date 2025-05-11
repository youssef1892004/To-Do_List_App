import express from 'express';
import Todo from '../models/Todo.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all todos for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single todo
router.get('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Check if todo belongs to user
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create todo
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    const todo = await Todo.create({
      title,
      description,
      priority,
      dueDate,
      user: req.user._id
    });
    
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update todo
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;
    
    let todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Check if todo belongs to user
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed, priority, dueDate },
      { new: true }
    );
    
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete todo
router.delete('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Check if todo belongs to user
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Todo.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Todo removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;