const { body } = require('express-validator');

const validarAfiliado = [
    //body('idGrupoFamiliarFK')
     //   .isInt({ min: 1 }).withMessage('El ID del grupo familiar debe ser un número entero válido'),

    body('tipoDocumento')
        .notEmpty().withMessage('El tipo de documento es obligatorio')
        .isIn(['DNI', 'LC', 'LE', 'Pasaporte']).withMessage('Tipo de documento inválido'),

    body('dni')
        .isNumeric().withMessage('El DNI debe ser numérico')
        .isLength({ min: 7, max: 8 }).withMessage('El DNI debe tener entre 7 y 8 dígitos'),

    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio'),

    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio'),

    body('parentesco')
        .notEmpty().withMessage('El parentesco es obligatorio')
        .isIn(['Titular', 'Hijo', 'Hija', 'Cónyuge', 'Padre', 'Otro']).withMessage('Parentesco inválido'),

    body('email')
        .optional()
        .isEmail().withMessage('El email no tiene un formato válido'),

    body('telefono')
        .optional()
        .isLength({ min: 7 }).withMessage('El teléfono debe tener al menos 7 dígitos'),

    body('direccion')
        .optional()
        .isString().withMessage('La dirección debe ser texto'),

    body('credencial')
        .optional()
        .matches(/^[0-9]{7}-[0-9]{2}$/).withMessage('La credencial debe tener formato 0000001-01')
];

module.exports = { validarAfiliado };
