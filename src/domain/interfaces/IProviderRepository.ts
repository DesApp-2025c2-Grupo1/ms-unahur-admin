import { Provider } from "../entities/Provider";

export interface IProviderRepository {
    findAll(): Promise<Provider[]>;
    findByField(field: string, value: any): Promise<Provider | null>;
}