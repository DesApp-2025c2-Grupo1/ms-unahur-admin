import { AffiliateSituation } from "../../../domain/entities/AffiliateSituation";

export const affiliateSituations: AffiliateSituation[] = [
    {
        id_afiliado_situacion: 1,
        id_situacion: 1,
        dni: "12345678",
        fecha_inicio: "2024-01-01",
        fecha_fin: "2024-12-31",
        observacion: "Activo con plan básico"
    },
    {
        id_afiliado_situacion: 2,
        id_situacion: 2,
        dni: "23456789",
        fecha_inicio: "2023-05-10",
        fecha_fin: "2024-05-10",
        observacion: "Cobertura pediátrica"
    },
    {
        id_afiliado_situacion: 3,
        id_situacion: 3,
        dni: "34567891",
        fecha_inicio: "2022-07-22",
        fecha_fin: "2023-07-22",
        observacion: "Baja por edad, pasó a titular"
    },
    {
        id_afiliado_situacion: 4,
        id_situacion: 1,
        dni: "45678912",
        fecha_inicio: "2021-09-05",
        fecha_fin: "2025-09-05",
        observacion: "Activo con plan familiar"
    },
    {
        id_afiliado_situacion: 5,
        id_situacion: 4,
        dni: "56789123",
        fecha_inicio: "2020-03-30",
        fecha_fin: "2025-03-30",
        observacion: "Jubilado, cobertura especial"
    }
];
