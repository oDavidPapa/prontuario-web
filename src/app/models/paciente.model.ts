import { Pessoa } from "./pessoa.model";

export interface Paciente {
  id: number;
  peso: number;
  altura: number;
  pessoa: Pessoa;
}
