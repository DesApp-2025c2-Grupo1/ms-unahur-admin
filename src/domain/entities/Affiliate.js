class Affiliate {
    constructor({
        grupoFamiliar,
        tipoDocumento,
        apellido,
        credencial,
        fecha_nacimiento,
        direccion,
        dni,
        email,
        nombre,
        parentesco,
        telefonos,
        plan,
        situaciones
    }) {
        this.grupoFamiliar = grupoFamiliar;
        this.tipoDocumento = tipoDocumento;
        this.apellido = apellido;
        this.credencial = credencial;
        this.direccion = direccion;
        this.dni = dni;
        this.email = email;
        this.nombre = nombre;
        this.parentesco = parentesco;
        this.telefonos = telefonos;
        this.plan = plan;
        this.fecha_nacimiento = fecha_nacimiento;
        this.situaciones = situaciones || [];
    }
}

module.exports = Affiliate;