const schedule = require('node-schedule');
const AffiliateRepository2 = require('../infrastructure/repositories/AffiliateRepository');

const repository = new AffiliateRepository2();

/**
 * Tarea que se ejecuta diariamente a las 00:30 Argentina
 * (Como la BD está en America/Argentina/Buenos_Aires, se ejecutará a esa hora)
 */
const job = schedule.scheduleJob('30 0 * * *', async function () {
    try {

        // Obtener todos los afiliados pendientes de activación
        const pendings = await repository.getAffiliatePendingRegistration();

        if (pendings.length === 0) {
            return;
        }

        // Filtrar solo los que deben activarse hoy
        const toActivate = filterCurrent(pendings);

        if (toActivate.length > 0) {
            await repository.updateAffiliatesPendingRegistration(toActivate);
        } else {
        }
    } catch (err) {
    }
});

/**
 * Filtra los afiliados cuya fecha_alta es HOY en Argentina
 */
const filterCurrent = (pendings) => {
    // Obtener fecha actual en formato YYYY-MM-DD
    const today = new Date().toLocaleDateString('en-CA');

    const filtered = pendings.filter(affiliate => {
        if (!affiliate.fecha_alta) return false;

        // Obtener fecha_alta en formato YYYY-MM-DD
        const affiliateDate = new Date(affiliate.fecha_alta).toLocaleDateString('en-CA');

        const isToday = affiliateDate === today;

        return isToday;
    });

    return filtered.map(aff => aff.dni);
};

module.exports = job;