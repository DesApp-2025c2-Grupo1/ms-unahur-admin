export class AffiliateSituation {
    constructor(
        public id_afiliado_situacion: number,
        public id_situacion: number,
        public dni: string,
        public fecha_inicio: string,
        public fecha_fin: string,
        public observacion: string
    ) { }
}