import { Provider } from '../../../domain/entities/Provider';
import { ProviderEntity } from '../entities/ProviderEntity';

export class ProviderMapper {
    static toDomain(entity: ProviderEntity): Provider {
        return new Provider(
            entity.apellido,
            entity.centroMedico,
            entity.cuilCuit,
            entity.especialidad,
            entity.nombre,
            entity.telefono,
        );
    }

    static toPersistence(domain: Provider): ProviderEntity {
        const entity = new ProviderEntity();
        entity.apellido = domain.apellido
        entity.centroMedico = domain.centroMedico
        entity.cuilCuit = domain.cuilCuit
        entity.especialidad = domain.especialidad
        entity.nombre = domain.nombre
        entity.telefono = domain.telefono
        return entity;
    }
}
