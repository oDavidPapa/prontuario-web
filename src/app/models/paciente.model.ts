import { Contato } from "./contato.model";
import { Endereco } from "./endereco-model";
import { Pessoa } from "./pessoa.model";

export interface Paciente {
  id: number;
  peso: number;
  altura: number;
  pessoa: Pessoa;
  contato?: Contato;
  endereco?: Endereco;
}
