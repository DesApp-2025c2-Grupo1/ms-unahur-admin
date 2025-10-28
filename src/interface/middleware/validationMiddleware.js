const { validationResult } = require('express-validator');

/*Middleware para manejar errores de validación. Si hay errores, devuelve status 400 con el detalle.*/
const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
};

module.exports = { validarCampos };
