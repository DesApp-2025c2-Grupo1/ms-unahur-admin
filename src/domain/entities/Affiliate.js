class Affiliate {
    constructor({
        idGrupoFamiliarFK,
        tipoDocumento,
        apellido,
        credencial,
        fecha_nacimiento,
        direccion,
        dni,
        email,
        nombre,
        parentesco,
        telefono,
        plan
    }) {
        this.idGrupoFamiliarFK = idGrupoFamiliarFK,
        this.tipoDocumento = tipoDocumento,
        this.apellido = apellido,
        this.credencial = credencial,
        this.direccion = direccion,
        this.dni = dni,
        this.email = email,
        this.nombre = nombre,
        this.parentesco = parentesco,
        this.telefono = telefono,
        this.plan = plan,
        this.fecha_nacimiento = fecha_nacimiento
    }
}

module.exports = Affiliate;
