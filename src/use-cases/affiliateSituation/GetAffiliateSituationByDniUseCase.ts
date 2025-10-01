import { AffiliateSituationRepository } from "../../domain/interfaces/AffiliateSituationRepository";

export class GetAffiliateSituationByDni {
  constructor(private affiliateSituationRepository: AffiliateSituationRepository) {}

  async execute(dni: string) {
    return await this.affiliateSituationRepository.getAffiliateSituationByDni(dni);
  }
}