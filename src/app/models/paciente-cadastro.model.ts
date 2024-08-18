import { PessoaCadastroDTO } from "./pessoa-cadastro.model";

export interface PacienteCadastroDTO {
  peso: number;
  altura: number;
  pessoaCadastroDTO: PessoaCadastroDTO;
}