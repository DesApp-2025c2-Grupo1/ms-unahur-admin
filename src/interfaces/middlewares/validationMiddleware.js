const { validationResult } = require('express-validator');


const validateFields = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const errorArray = errores.array();
        const details = errorArray.map(err => ({
            field: err.param || err.path || err.location,
            message: err.msg,
            value: err.value
        }));

        const hasEmailErrors = errorArray.some(e => {
            const p = String(e.param || e.path || e.location || '').toLowerCase();
            const m = String(e.msg || '').toLowerCase();
            return p.includes('mail') || p.includes('mails') || m.includes('email') || m.includes('mail');
        });

        const hasPhoneErrors = errorArray.some(e => {
            const p = String(e.param || e.path || e.location || '').toLowerCase();
            const m = String(e.msg || '').toLowerCase();
            return p.includes('telefono') || p.includes('telefonos') || m.includes('teléfono') || m.includes('telefono');
        });

        // If validator threw a specific 'require at least one contact' message, surface a combined message
        const requiresAtLeastOne = errorArray.some(e => {
            const m = String(e.msg || '').toLowerCase();
            return m.includes('se requiere al menos un tel') || m.includes('se requiere al menos un teléfono') || m.includes('se requiere al menos un telefono') || m.includes('se requiere al menos un email');
        });

        let topMessage = 'Error de validación';
        if (requiresAtLeastOne) topMessage = 'Completar teléfono y email';
        else if (hasEmailErrors && hasPhoneErrors) topMessage = 'Completar teléfono y email';
        else if (hasEmailErrors) topMessage = 'Completar email';
        else if (hasPhoneErrors) topMessage = 'Completar teléfono';

        return res.status(400).json({
            error: topMessage,
            details
        });
    }
    next();
};

module.exports = { validateFields };
