import { Repository } from "typeorm";
import { IProviderRepository } from "../../domain/interfaces/IProviderRepository";
import { ProviderEntity } from "../database/entities/ProviderEntity";
import { AppDataSource } from "../database/data-source";
import { ProviderMapper } from "../database/mapper/ProviderMapper";
import { Provider } from "../../domain/entities/Provider";

export class ProviderRepository implements IProviderRepository {

    private ormRepo: Repository<ProviderEntity>;

    constructor() {
        this.ormRepo = AppDataSource.getRepository(ProviderEntity);
    }

    async findAll(): Promise<Provider[]> {
        const entities = await this.ormRepo.find();
        return entities.map(provider => ProviderMapper.toDomain(provider));

    }
    async findByField(field: string, value: any): Promise<any | null> {
        throw new Error("Method not implemented.");
    }

}