import { IProviderRepository } from "../../domain/interfaces/IProviderRepository";

export class GetProviderByFieldUseCase {
  constructor(private IProviderRepository: IProviderRepository) { }


  async execute(field: string, value: any) {
    return await this.IProviderRepository.findByField(field, value);
  }
}