const express = require('express');
const AgendaRepository = require('../../infrastructure/repositories/AgendaRepository');
const AgendaService = require('../../use-cases/agenda/AgendaService');
const AgendaController = require('../controllers/AgendaController');

const router = express.Router();

const repository = new AgendaRepository();
const service = new AgendaService(repository);
const controller = new AgendaController(service);

const { 
    validateAgendaCreate, 
    validateAgendaUpdate, 
    validateAgendaId 
} = require('../validators/AgendaValidator');
const { validateFields } = require('../middlewares/validationMiddleware');

// GET /agendas -> listar todas las agendas (con filtros opcionales)
// Query params opcionales: ?cuitCuil=XXX&idEspecialidad=Y
router.get('/agendas', controller.findAll);

// GET /agendas/:id -> obtener una agenda específica
router.get('/agendas/:id', validateAgendaId, validateFields, controller.findById);

// POST /agendas -> crear nueva agenda
router.post('/agendas', validateAgendaCreate, validateFields, controller.create);

// PUT /agendas/:id -> actualizar agenda
router.put('/agendas/:id', validateAgendaUpdate, validateFields, controller.update);

// DELETE /agendas/:id -> eliminar agenda (soft delete)
router.delete('/agendas/:id', validateAgendaId, validateFields, controller.delete);

module.exports = router;