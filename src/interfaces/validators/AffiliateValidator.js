const { body } = require('express-validator');

const validateAffiliate = [
    // body('tipoDocumento')
    //     .notEmpty().withMessage('El tipo de documento es obligatorio')
    //     .isIn(['DNI', 'LC', 'LE', 'Pasaporte']).withMessage('El tipo de documento no es válido'),

    body('dni')
        .notEmpty().withMessage('El DNI es obligatorio')
        .isNumeric().withMessage('El DNI debe ser numérico')
        .isLength({ min: 7, max: 8 }).withMessage('El DNI debe tener entre 7 y 8 dígitos'),

    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser texto'),

    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isString().withMessage('El apellido debe ser texto'),

    // body('parentesco')
    //     .notEmpty().withMessage('El parentesco es obligatorio')
    //     .isIn(['Titular', 'Hijo', 'Hija', 'Cónyuge', 'Padre', 'Otro']).withMessage('El parentesco no es válido'),

    body('email')
        .optional()
        .isEmail().withMessage('El correo electrónico no tiene un formato válido'),

    body('telefono')
        .optional()
        .isLength({ min: 7 }).withMessage('El teléfono debe tener al menos 7 dígitos')
        .isNumeric().withMessage('El teléfono debe contener solo números'),

    body('direccion')
        .optional()
        .isString().withMessage('La dirección debe ser texto'),

    body('credencial')
        .optional()
        .matches(/^[0-9]{7}-[0-9]{2}$/).withMessage('La credencial debe tener formato 0000001-01')
];

module.exports = { validateAffiliate };
