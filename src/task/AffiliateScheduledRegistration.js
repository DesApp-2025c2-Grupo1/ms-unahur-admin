const schedule = require('node-schedule');
const AffiliateRepository2 = require('../infrastructure/repositories/AffiliateRepository');

const repository = new AffiliateRepository2();
let pendings = [];

const job = schedule.scheduleJob('0 0 0 * * *', async function () {
    try {
        pendings = await repository.getAffiliatePendingRegistration();
        const filteredPendings = filterCurrent(pendings);
        if (filteredPendings.length > 0) {
            await updateDate(filteredPendings);
            console.log(`Actualizados ${filteredPendings.length} afiliados.`);
        } else {
            console.log('No hay afiliados para actualizar hoy.');
        }
    } catch (err) {
        console.error('Error updating pending affiliates:', err);
    }
});

const filterCurrent = (pendings) => {
    const today = new Date().toLocaleDateString('en-CA');
    return pendings
        .filter(a => a.fecha_alta && new Date(a.fecha_alta).toLocaleDateString('en-CA') === today)
        .map(aff => aff.dni);
}

const updateDate = async (data) => {
    await repository.updateAffiliatesPendingRegistration(data);
}

module.exports = job;