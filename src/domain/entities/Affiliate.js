class Affiliate {
    constructor({
        idGrupoFamiliarFK,
        tipoDocumento,
        apellido,
        credencial,
        direccion,
        dni,
        email,
        nombre,
        parentesco,
        telefono,
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
        this.telefono = telefono
    }
}

module.exports = Affiliate;
