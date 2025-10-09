import { MigrationInterface, QueryRunner } from "typeorm";

export class V01SeedAffiliates1760037307157 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO affiliates (credencial, dni, nombre, apellido, fecha_nacimento, direccion, id_grupo_familiar) VALUES
            -- Grupo Familiar 0000001
            ('0000001-01', '12345678', 'Joaquin', 'Mogno', '2002-12-16', 'Calle Falsa 123', 1),
            ('0000001-02', '23456789', 'Juan', 'Perez', '2019-05-10', 'Av. Vergara 742', 1),
            ('0000001-03', '34567891', 'Maria', 'Mogno', '2005-07-22', 'Calle Falsa 123', 1),
            ('0000001-04', '45678912', 'Ana', 'Lopez', '1980-09-05', 'Calle Falsa 123', 1),
            ('0000001-05', '56789123', 'Carlos', 'Mogno', '1978-03-30', 'Calle Falsa 123', 1),

            -- Grupo Familiar 0000002
            ('0000002-01', '67891234', 'Pedro', 'Gomez', '1975-11-15', 'Calle Ejemplo 456', 2),
            ('0000002-02', '78912345', 'Lucia', 'Gomez', '1977-01-09', 'Calle Ejemplo 456', 2),
            ('0000002-03', '89123456', 'Sofia', 'Gomez', '2003-06-03', 'Calle Ejemplo 456', 2),
            ('0000002-04', '91234567', 'Diego', 'Gomez', '2006-12-25', 'Calle Ejemplo 456', 2),
            ('0000002-05', '11223344', 'Valentina', 'Gomez', '2011-08-14', 'Calle Ejemplo 456', 2);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM affiliates WHERE credencial IN (
                '0000001-01', '0000001-02', '0000001-03', '0000001-04', '0000001-05',
                '0000002-01', '0000002-02', '0000002-03', '0000002-04', '0000002-05'
            );
        `);
    }

}
