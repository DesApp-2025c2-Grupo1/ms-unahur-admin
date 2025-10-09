import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class V02CreateProviders1760037307157 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      INSERT INTO providers (cuil_cuit, nombre, apellido, especialidad, telefono, centro_medico)
      VALUES
        ('23-42054012-9', 'Ramon', 'Carrillo', 'Pediatría', '1144585907', '-'),
        ('27-30123456-5', 'Ana', 'Gomez', 'Cardiología', '1156781234', 'Hospital Central'),
        ('20-45678901-2', 'Luis', 'Martinez', 'Dermatología', '1165432198', 'Clinica Norte')
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DELETE FROM doctors
      WHERE cuil_cuit IN ('23-42054012-9', '27-30123456-5', '20-45678901-2')
    `);
    }

}
