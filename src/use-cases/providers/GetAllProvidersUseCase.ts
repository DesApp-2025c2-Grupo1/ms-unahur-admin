import { AffiliatesRepository } from "../../domain/interfaces/AffiliatesRepository";
import { IProviderRepository } from "../../domain/interfaces/IProviderRepository";

export class GetAllProvidersUseCase {
    constructor(private IProviderRepository: IProviderRepository) { }

    async execute() {
        return await this.IProviderRepository.findAll();
    }
}