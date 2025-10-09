import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('providers')
export class ProviderEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'cuil_cuit' })
    cuilCuit!: string;

    @Column()
    nombre!: string;

    @Column()
    apellido!: string;

    @Column()
    especialidad!: string;

    @Column()
    telefono!: string;

    @Column({ name: 'centro_medico' })
    centroMedico!: string;
}