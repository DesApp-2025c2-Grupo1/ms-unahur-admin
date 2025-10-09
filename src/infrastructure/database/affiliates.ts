import { Affiliate } from "../../domain/entities/Affiliate";

export const affiliates: Affiliate[] = [
    // Grupo Familiar 0000001
    { credencial: "0000001-01", dni: "12345678", nombre: "Joaquin", apellido: "Mogno", fecha_nacimento: "16/12/2002", direccion: "Calle Falsa 123", id_grupo_familiar: 1 },
    { credencial: "0000001-02", dni: "23456789", nombre: "Juan", apellido: "Perez", fecha_nacimento: "10/05/2019", direccion: "Av. Vergara 742", id_grupo_familiar: 1 },
    { credencial: "0000001-03", dni: "34567891", nombre: "Maria", apellido: "Mogno", fecha_nacimento: "22/07/2005", direccion: "Calle Falsa 123", id_grupo_familiar: 1 },
    { credencial: "0000001-04", dni: "45678912", nombre: "Ana", apellido: "Lopez", fecha_nacimento: "05/09/1980", direccion: "Calle Falsa 123", id_grupo_familiar: 1 },
    { credencial: "0000001-05", dni: "56789123", nombre: "Carlos", apellido: "Mogno", fecha_nacimento: "30/03/1978", direccion: "Calle Falsa 123", id_grupo_familiar: 1 },

    // Grupo Familiar 0000002
    { credencial: "0000002-01", dni: "67891234", nombre: "Pedro", apellido: "Gomez", fecha_nacimento: "15/11/1975", direccion: "Calle Ejemplo 456", id_grupo_familiar: 2 },
    { credencial: "0000002-02", dni: "78912345", nombre: "Lucia", apellido: "Gomez", fecha_nacimento: "09/01/1977", direccion: "Calle Ejemplo 456", id_grupo_familiar: 2 },
    { credencial: "0000002-03", dni: "89123456", nombre: "Sofia", apellido: "Gomez", fecha_nacimento: "03/06/2003", direccion: "Calle Ejemplo 456", id_grupo_familiar: 2 },
    { credencial: "0000002-04", dni: "91234567", nombre: "Diego", apellido: "Gomez", fecha_nacimento: "25/12/2006", direccion: "Calle Ejemplo 456", id_grupo_familiar: 2 },
    { credencial: "0000002-05", dni: "11223344", nombre: "Valentina", apellido: "Gomez", fecha_nacimento: "14/08/2011", direccion: "Calle Ejemplo 456", id_grupo_familiar: 2 },

];
