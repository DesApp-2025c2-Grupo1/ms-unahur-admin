const schedule = require('node-schedule');
const AffiliateRepository2 = require('../infrastructure/repositories/AffiliateRepository');

const repository = new AffiliateRepository2();

/**
 * Tarea que se ejecuta diariamente a las 00:30 Argentina
 * (Como la BD está en America/Argentina/Buenos_Aires, se ejecutará a esa hora)
 */
const job = schedule.scheduleJob('30 0 * * *', async function () {
    try {
        console.log('🔄 [' + new Date().toLocaleString('es-AR') + '] Verificando afiliados pendientes...');
        
        // Obtener todos los afiliados pendientes de activación
        const pendings = await repository.getAffiliatePendingRegistration();
        console.log(`📋 Total pendientes encontrados: ${pendings.length}`);
        
        if (pendings.length === 0) {
            console.log('✅ No hay afiliados para activar hoy');
            return;
        }

        // Filtrar solo los que deben activarse hoy
        const toActivate = filterCurrent(pendings);
        
        if (toActivate.length > 0) {
            console.log(`✅ Activando ${toActivate.length} afiliado(s)...`);
            await repository.updateAffiliatesPendingRegistration(toActivate);
            console.log(`✅ ${toActivate.length} afiliado(s) activado(s) correctamente`);
        } else {
            console.log('ℹ️ Ningún afiliado con fecha_alta para hoy');
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
});

/**
 * Filtra los afiliados cuya fecha_alta es HOY en Argentina
 */
const filterCurrent = (pendings) => {
    // Obtener fecha actual en formato YYYY-MM-DD
    const today = new Date().toLocaleDateString('en-CA');
    
    console.log(`📅 Fecha actual: ${today}`);
    
    const filtered = pendings.filter(affiliate => {
        if (!affiliate.fecha_alta) return false;
        
        // Obtener fecha_alta en formato YYYY-MM-DD
        const affiliateDate = new Date(affiliate.fecha_alta).toLocaleDateString('en-CA');
        
        const isToday = affiliateDate === today;
        
        console.log(`  DNI ${affiliate.dni}: fecha_alta=${affiliateDate} ${isToday ? '✓ HOY' : ''}`);
        
        return isToday;
    });

    return filtered.map(aff => aff.dni);
};

module.exports = job;