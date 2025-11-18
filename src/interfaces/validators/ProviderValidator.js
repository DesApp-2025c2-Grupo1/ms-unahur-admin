const { body } = require('express-validator');

const CUIT_REGEX = /^[0-9]{1,2}-?[0-9]{6,8}-?[0-9]{1}$/;

const validateProviderCreate = [
    body('cuitCuil')
        .notEmpty().withMessage('El CUIT/CUIL es obligatorio')
        .isString().withMessage('El CUIT/CUIL debe ser texto')
        .matches(CUIT_REGEX).withMessage('Formato de CUIT/CUIL inválido'),

    body('nombreCompleto')
        .notEmpty().withMessage('El nombre completo es obligatorio')
        .isString(),

    body('tipoPrestador')
        .notEmpty().withMessage('El tipo de prestador es obligatorio')
        .isIn(['profesional', 'centro_medico']).withMessage('Tipo de prestador inválido'),

    body('telefonos')
        .optional()
        .isArray().withMessage('telefonos debe ser un array'),
    body('telefonos.*')
        .optional()
        .isString().withMessage('teléfono debe ser texto')
        .isLength({ min: 3, max: 20 }).withMessage('teléfono debe tener entre 3 y 20 caracteres'),

    body('mails')
        .optional()
        .isArray().withMessage('mails debe ser un array'),
    body('mails.*')
        .optional()
        .isEmail().withMessage('email con formato inválido'),

    body('especialidades')
        .optional()
        .isArray().withMessage('especialidades debe ser un array de ids'),
    body('especialidades.*')
        .optional()
        .isInt().withMessage('especialidad debe ser id numérico'),

    // Validar lugaresAtencion como un array de objetos
    body('lugaresAtencion')
        .optional()
        .isArray().withMessage('lugaresAtencion debe ser un array'),
    body('lugaresAtencion.*.etiqueta').optional().isString(),
    body('lugaresAtencion.*.calle').optional().isString(),
    body('lugaresAtencion.*.numero').optional().isString(),
    body('lugaresAtencion.*.localidad').optional().isString(),
    body('lugaresAtencion.*.provincia').optional().isString(),
    body('lugaresAtencion.*.cp').optional().isString(),
    body('lugaresAtencion.*.horarios').optional().isArray(),
    body('lugaresAtencion.*.horarios.*.dias').optional().isArray(),
    body('lugaresAtencion.*.horarios.*.desde').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('hora desde formato HH:MM'),
    body('lugaresAtencion.*.horarios.*.hasta').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('hora hasta formato HH:MM'),
];

const validateProviderUpdate = [
    // For update, nothing strictly required - but validate shapes if present
    body('nombreCompleto').optional().isString(),
    body('tipoPrestador').optional().isIn(['profesional', 'centro_medico']),
    body('telefonos').optional().isArray(),
    body('telefonos.*').optional().isString(),
    body('mails').optional().isArray(),
    body('mails.*').optional().isEmail(),
    body('especialidades').optional().isArray(),
    body('especialidades.*').optional().isInt(),
    
    // Validar lugaresAtencion como un array de objetos
    body('lugaresAtencion').optional().isArray(),
    body('lugaresAtencion.*.etiqueta').optional().isString(),
    body('lugaresAtencion.*.calle').optional().isString(),
    body('lugaresAtencion.*.numero').optional().isString(),
    body('lugaresAtencion.*.localidad').optional().isString(),
    body('lugaresAtencion.*.provincia').optional().isString(),
    body('lugaresAtencion.*.cp').optional().isString(),
    body('lugaresAtencion.*.horarios').optional().isArray(),
    body('lugaresAtencion.*.horarios.*.dias').optional().isArray(),
    body('lugaresAtencion.*.horarios.*.desde').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/),
    body('lugaresAtencion.*.horarios.*.hasta').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/),
];

module.exports = { validateProviderCreate, validateProviderUpdate };
