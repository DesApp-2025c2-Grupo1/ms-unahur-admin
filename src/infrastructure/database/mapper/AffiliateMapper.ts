import { Affiliate } from '../../../domain/entities/Affiliate';
import { AffiliateEntity } from '../entities/AffiliateEntity';

export class AffiliateMapper {
    static toDomain(entity: AffiliateEntity): Affiliate {
        return new Affiliate(
            entity.credencial,
            entity.dni,
            entity.nombre,
            entity.apellido,
            entity.fecha_nacimento,
            entity.direccion,
            entity.id_grupo_familiar
        );
    }

    static toPersistence(domain: Affiliate): AffiliateEntity {
        const entity = new AffiliateEntity();
        entity.credencial = domain.credencial;
        entity.dni = domain.dni;
        entity.nombre = domain.nombre;
        entity.apellido = domain.apellido;
        entity.fecha_nacimento = domain.fecha_nacimento;
        entity.direccion = domain.direccion;
        entity.id_grupo_familiar = domain.id_grupo_familiar;
        return entity;
    }
}
