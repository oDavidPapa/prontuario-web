import { PessoaCadastroDTO } from "./pessoa-cadastro.model";

export interface UsuarioCadastroDTO {
    login: string;
    senha: string;
    role: string; 
    idPessoa: number;
    pessoaCadastroDTO: PessoaCadastroDTO;
}