import { Repository } from 'typeorm';
import { AffiliateEntity } from '../database/entities/AffiliateEntity';
import { Affiliate } from '../../domain/entities/Affiliate';
import { AffiliateMapper } from '../database/mapper/AffiliateMapper';
import { AppDataSource } from '../database/data-source';
import { AffiliatesRepository } from '../../domain/interfaces/AffiliatesRepository';


export class AffiliateRepository implements AffiliatesRepository {
    
    private ormRepo: Repository<AffiliateEntity>;

    constructor() {
        this.ormRepo = AppDataSource.getRepository(AffiliateEntity);
    }

    async findAll(): Promise<Affiliate[]> {
        const entities = await this.ormRepo.find();
        return entities.map(afiliate => AffiliateMapper.toDomain(afiliate))
    }

    async findByField(field: string, value: any): Promise<Affiliate | null> {
        const whereClause = { [field]: value };
        const entity = await this.ormRepo.findOneBy(whereClause);
        if (!entity) {
            return null;
        }
        return AffiliateMapper.toDomain(entity);
    }

}
