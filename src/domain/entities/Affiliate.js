class Affiliate {
    constructor({
        dni,
        idGrupoFamiliar,
        numeroMiembro,
        credencial,
        tipoDocumento,
        nombre,
        apellido,
        fechaNacimiento,
        parentesco,
        validoDesde,
        plan,
        validoHasta = null,
        grupoFamiliar = null,
        situaciones
    } = {}) {
        this.dni = dni || '';
        this.idGrupoFamiliar = idGrupoFamiliar || 0;
        this.numeroMiembro = numeroMiembro || 0;
        this.credencial = credencial || '';
        this.tipoDocumento = tipoDocumento || '';
        this.nombre = nombre || '';
        this.apellido = apellido || '';
        this.fechaNacimiento = fechaNacimiento || null;
        this.parentesco = parentesco || '';
        this.validoDesde = validoDesde || null;
        this.validoHasta = validoHasta;
        this.plan = plan;
        this.grupoFamiliar = grupoFamiliar; // Relación a la clase FamilyGroup
        this.situaciones =  situaciones; // Relación a AffiliateSituation
    }
}

module.exports = Affiliate;
