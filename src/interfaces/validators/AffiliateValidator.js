const { body } = require('express-validator');

const validateAffiliate = [
    // Tipo de documento
    body('tipoDocumento')
        .notEmpty().withMessage('El tipo de documento es obligatorio')
        .isIn(['DNI', 'CUIL', 'CUIT', 'DOCUMENTO EXTRANJERO', 'CDI', 'Pasaporte'])
        .withMessage('El tipo de documento no es válido'),

    // DNI
    body('dni')
        .notEmpty().withMessage('El DNI es obligatorio')
        .isString().withMessage('El DNI debe ser texto')
        .matches(/^[0-9]{7,8}$/).withMessage('El DNI debe tener entre 7 y 8 dígitos numéricos'),

    // Nombre
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser texto')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),

    // Apellido
    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isString().withMessage('El apellido debe ser texto')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),

    // Fecha de nacimiento
    body('fecha_nacimiento')
        .notEmpty().withMessage('La fecha de nacimiento es obligatoria')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('La fecha debe tener formato YYYY-MM-DD')
        .custom((value) => {
            const fecha = new Date(value);
            const hoy = new Date();
            if (fecha > hoy) {
                throw new Error('La fecha de nacimiento no puede ser futura');
            }
        }),

    // Plan
    body('plan')
        .notEmpty().withMessage('El plan es obligatorio')
        .isInt({ min: 1 }).withMessage('El plan debe ser un número válido'),

    // Dirección
    body('direccion')
        .optional()
        .isString().withMessage('La dirección debe ser texto')
        .isLength({ max: 100 }).withMessage('La dirección no puede superar los 100 caracteres'),

    // Emails (array)
    body('emails')
        .optional()
        .isArray().withMessage('Los emails deben ser un array'),
    
    body('emails.*.email')
        .optional()
        .isEmail().withMessage('Formato de email inválido')
        .isLength({ max: 50 }).withMessage('El email no puede superar los 50 caracteres'),

    // Teléfonos (array)
    body('telefonos')
        .optional()
        .isArray().withMessage('Los teléfonos deben ser un array'),
    
    body('telefonos.*.telefono')
        .optional()
        .matches(/^[0-9]{7,15}$/).withMessage('El teléfono debe tener entre 7 y 15 dígitos'),

    // Situaciones (array)
    body('situaciones')
        .optional()
        .isArray().withMessage('Las situaciones deben ser un array'),
    
    body('situaciones.*.id')
        .optional()
        .isInt({ min: 1 }).withMessage('El ID de la situación debe ser un número válido'),

    // Familiares (array)
    body('familiares')
        .optional()
        .isArray().withMessage('Los familiares deben ser un array'),

    body('familiares.*.dni')
        .optional()
        .matches(/^[0-9]{7,8}$/).withMessage('El DNI del familiar debe tener entre 7 y 8 dígitos'),

    body('familiares.*.nombre')
        .optional()
        .notEmpty().withMessage('El nombre del familiar es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),

    body('familiares.*.apellido')
        .optional()
        .notEmpty().withMessage('El apellido del familiar es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),

    body('familiares.*.fecha_nacimiento')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('La fecha debe tener formato YYYY-MM-DD'),

    body('familiares.*.parentesco')
        .optional()
        .isIn(['Cónyuge', 'Hijo', 'Hija', 'Familiar a cargo'])
        .withMessage('El parentesco no es válido'),
];

module.exports = { validateAffiliate };