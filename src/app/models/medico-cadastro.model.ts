import { PessoaCadastroDTO } from "./pessoa-cadastro.model";

export interface MedicoCadastroDTO {
  crm: string;
  especialidade: string;
  pessoaCadastroDTO: PessoaCadastroDTO;
}