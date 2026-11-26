const express = require('express');
const dashboard = require('../controllers/dashboardController');
const tickets = require('../controllers/ticketController');
const comments = require('../controllers/commentController');
const technicians = require('../controllers/technicianController');
const categories = require('../controllers/categoryController');
const users = require('../controllers/userController');
const { requireRole } = require('../middlewares/auth');

const router = express.Router();

// Dashboard
router.get('/', dashboard.index);

// Chamados
router.get('/tickets', tickets.index);
router.get('/users', requireRole('admin'), users.index);
router.patch('/users/:id', requireRole('admin'), users.updateRole);
router.get('/tickets/new', tickets.new);
router.post('/tickets', tickets.create);
router.get('/tickets/:id', tickets.show);
router.get('/tickets/:id/edit', requireRole('admin'), tickets.edit);
router.put('/tickets/:id', requireRole('admin'), tickets.update);
router.patch('/tickets/:id/quick', requireRole('tecnico', 'admin'), tickets.quickUpdate);
router.delete('/tickets/:id', requireRole('admin'), tickets.destroy);
router.post('/tickets/:id/comments', comments.create);

// Técnicos
router.get('/technicians', requireRole('admin'), technicians.index);
router.get('/technicians/new', requireRole('admin'), technicians.new);
router.post('/technicians', requireRole('admin'), technicians.create);
router.get('/technicians/:id/edit', requireRole('admin'), technicians.edit);
router.put('/technicians/:id', requireRole('admin'), technicians.update);
router.delete('/technicians/:id', requireRole('admin'), technicians.destroy);

// Categorias
router.get('/categories', requireRole('admin'), categories.index);
router.get('/categories/new', requireRole('admin'), categories.new);
router.post('/categories', requireRole('admin'), categories.create);
router.get('/categories/:id/edit', requireRole('admin'), categories.edit);
router.put('/categories/:id', requireRole('admin'), categories.update);
router.delete('/categories/:id', requireRole('admin'), categories.destroy);

module.exports = router;
