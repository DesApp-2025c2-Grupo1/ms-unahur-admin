const { body, param } = require('express-validator');

const validateAgendaCreate = [
    body('cuitCuil')
        .notEmpty().withMessage('El CUIT/CUIL del prestador es requerido')
        .isString().withMessage('El CUIT/CUIL debe ser una cadena de texto'),
    
    body('idEspecialidad')
        .notEmpty().withMessage('La especialidad es requerida')
        .isInt({ min: 1 }).withMessage('El ID de especialidad debe ser un número entero positivo'),
    
    body('idLugar')
        .notEmpty().withMessage('El lugar de atención es requerido')
        .isInt({ min: 1 }).withMessage('El ID de lugar debe ser un número entero positivo'),
    
    body('duracionTurno')
        .notEmpty().withMessage('La duración del turno es requerida')
        .isInt({ min: 15, max: 240 }).withMessage('La duración debe estar entre 15 y 240 minutos'),
    
    body('bloques')
        .isArray({ min: 1 }).withMessage('Debe definir al menos un bloque horario'),
    
    body('bloques.*.dias')
        .isArray({ min: 1 }).withMessage('Cada bloque debe tener al menos un día'),
    
    body('bloques.*.dias.*')
        .isIn(['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'])
        .withMessage('Día inválido'),
    
    body('bloques.*.desde')
        .notEmpty().withMessage('La hora de inicio es requerida')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido (HH:MM)'),
    
    body('bloques.*.hasta')
        .notEmpty().withMessage('La hora de fin es requerida')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido (HH:MM)'),
    
    body('fechaInicio')
        .optional()
        .isISO8601().withMessage('Formato de fecha inválido'),
    
    body('fechaFin')
        .optional()
        .isISO8601().withMessage('Formato de fecha inválido')
];

const validateAgendaUpdate = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID de agenda inválido'),
    
    body('idEspecialidad')
        .optional()
        .isInt({ min: 1 }).withMessage('El ID de especialidad debe ser un número entero positivo'),
    
    body('idLugar')
        .optional()
        .isInt({ min: 1 }).withMessage('El ID de lugar debe ser un número entero positivo'),
    
    body('duracionTurno')
        .optional()
        .isInt({ min: 15, max: 240 }).withMessage('La duración debe estar entre 15 y 240 minutos'),
    
    body('bloques')
        .optional()
        .isArray({ min: 1 }).withMessage('Debe definir al menos un bloque horario'),
    
    body('bloques.*.dias')
        .optional()
        .isArray({ min: 1 }).withMessage('Cada bloque debe tener al menos un día'),
    
    body('bloques.*.dias.*')
        .optional()
        .isIn(['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'])
        .withMessage('Día inválido'),
    
    body('bloques.*.desde')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido (HH:MM)'),
    
    body('bloques.*.hasta')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido (HH:MM)'),
    
    body('fechaFin')
        .optional()
        .isISO8601().withMessage('Formato de fecha inválido')
];

const validateAgendaId = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID de agenda inválido')
];

module.exports = {
    validateAgendaCreate,
    validateAgendaUpdate,
    validateAgendaId
};