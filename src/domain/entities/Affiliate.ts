export class Affiliate {
    constructor(
        public credencial: string,
        public dni: string,
        public nombre: string,
        public apellido: string,
        public fecha_nacimento: string,
        public direccion: string,
        public id_grupo_familiar:number
    ) { }
}