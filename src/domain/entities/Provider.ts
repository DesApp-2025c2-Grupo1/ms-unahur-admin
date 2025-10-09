export class Provider {
    cuilCuit: string;
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono: string;
    centroMedico: string;

    constructor(
        cuilCuit: string,
        nombre: string,
        apellido: string,
        especialidad: string,
        telefono: string,
        centroMedico: string
    ) {
        this.cuilCuit = cuilCuit;
        this.nombre = nombre;
        this.apellido = apellido;
        this.especialidad = especialidad;
        this.telefono = telefono;
        this.centroMedico = centroMedico;
    }
}