const { body } = require('express-validator');

const CUIT_REGEX = /^[0-9]{1,2}-?[0-9]{6,8}-?[0-9]{1}$/;

const validateNoDuplicateSpecialties = (req, res, next) => {
    const { especialidades } = req.body;
    
    if (especialidades && Array.isArray(especialidades)) {
        const uniqueIds = new Set(especialidades);
        
        if (uniqueIds.size !== especialidades.length) {
            return res.status(400).json({ 
                error: 'No se permiten especialidades duplicadas',
                details: 'La lista de especialidades contiene IDs repetidos'
            });
        }
    }
    
    next();
};

const validateProviderCreate = [
    // Require at least one contact method (telefono or mail)
    body().custom((_, { req }) => {
        const telefonos = req.body.telefonos;
        const mails = req.body.mails;

        const hasPhones = Array.isArray(telefonos) && telefonos.length > 0;
        const hasMails = Array.isArray(mails) && mails.length > 0;

        if (!hasPhones && !hasMails) {
            throw new Error('Se requiere al menos un teléfono o un email');
        }
        return true;
    }),
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

    body('especialidades')
        .optional()
        .isArray().withMessage('especialidades debe ser un array de ids')
        .custom((value) => {
            if (value && value.length > 0) {
                const uniqueIds = new Set(value);
                if (uniqueIds.size !== value.length) {
                    throw new Error('No se permiten especialidades duplicadas');
                }
            }
            return true;
        }),
    
    body('especialidades.*')
        .optional()
        .isInt({ min: 1 }).withMessage('especialidad debe ser id numérico positivo'),


    body('telefonos')
        .optional()
        .isArray().withMessage('telefonos debe ser un array'),
    body('telefonos.*')
        .optional()
        .isString().withMessage('teléfono debe ser texto')
        .custom((value) => {
            const digits = (String(value).match(/\d/g) || []).length;
            if (digits < 10) throw new Error('El teléfono debe contener al menos 10 dígitos numéricos');
            return true;
        }),

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
    body('especialidades')
        .optional()
        .isArray()
        .custom((value) => {
            if (value && value.length > 0) {
                const uniqueIds = new Set(value);
                if (uniqueIds.size !== value.length) {
                    throw new Error('No se permiten especialidades duplicadas');
                }
            }
            return true;
        }),
    
    body('especialidades.*')
        .optional()
        .isInt({ min: 1 }),

    // For update, nothing strictly required - but validate shapes if present
    body('nombreCompleto').optional().isString(),
    body('tipoPrestador').optional().isIn(['profesional', 'centro_medico']),
    body('telefonos').optional().isArray(),
    body('telefonos.*').optional().isString().withMessage('teléfono debe ser texto').custom((value) => {
        const digits = (String(value).match(/\d/g) || []).length;
        if (digits < 10) throw new Error('El teléfono debe contener al menos 10 dígitos numéricos');
        return true;
    }),
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

module.exports = { 
    validateProviderCreate, 
    validateProviderUpdate, 
    validateNoDuplicateSpecialties 
};