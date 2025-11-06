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
        .isLength({ min: 6 }).withMessage('teléfono muy corto'),

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

    body('lugarAtencion')
        .optional()
        .isObject().withMessage('lugarAtencion debe ser un objeto'),
    body('lugarAtencion.direccion').optional().isString(),
    body('lugarAtencion.localidad').optional().isString(),
    body('lugarAtencion.provincia').optional().isString(),
    body('lugarAtencion.codigoPostal').optional().isString(),
    body('lugarAtencion.horarios').optional().isArray(),
    body('lugarAtencion.horarios.*.dias').optional().isArray(),
    body('lugarAtencion.horarios.*.desde').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('hora desde formato HH:MM'),
    body('lugarAtencion.horarios.*.hasta').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('hora hasta formato HH:MM'),
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
    body('lugarAtencion').optional().isObject(),
    body('lugarAtencion.direccion').optional().isString(),
    body('lugarAtencion.localidad').optional().isString(),
    body('lugarAtencion.provincia').optional().isString(),
    body('lugarAtencion.codigoPostal').optional().isString(),
    body('lugarAtencion.horarios').optional().isArray(),
    body('lugarAtencion.horarios.*.dias').optional().isArray(),
    body('lugarAtencion.horarios.*.desde').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/),
    body('lugarAtencion.horarios.*.hasta').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/),
];

module.exports = { validateProviderCreate, validateProviderUpdate };
