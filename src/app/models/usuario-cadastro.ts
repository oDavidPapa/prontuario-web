import { ContatoCadastroDTO } from "./contato-cadastro.model";
import { PessoaCadastroDTO } from "./pessoa-cadastro.model";

export interface UsuarioCadastroDTO {
    login: string;
    senha: string;
    role: string; 
    idPessoa: number;
    pessoaCadastroDTO: PessoaCadastroDTO;
    contatoCadastroDTO: ContatoCadastroDTO;
}