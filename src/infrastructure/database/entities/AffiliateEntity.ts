import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('affiliates')
export class AffiliateEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    credencial!: string;

    @Column()
    dni!: string;

    @Column()
    nombre!: string;

    @Column()
    apellido!: string;

    @Column({ type: 'date' })
    fecha_nacimento!: string;

    @Column()
    direccion!: string;

    @Column({ name: 'id_grupo_familiar' })
    id_grupo_familiar!: number;
}
