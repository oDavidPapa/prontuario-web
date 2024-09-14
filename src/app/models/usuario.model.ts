import { Pessoa } from "./pessoa.model";

export interface Usuario {
    id: number;
    login: string;
    role: string;
    status: string;
    pessoa: Pessoa;
}
