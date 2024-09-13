import { Pessoa } from "./pessoa.model";

export interface Medico {
  id: number;
  crm: string;
  especialidade: string;
  pessoa: Pessoa;
}
