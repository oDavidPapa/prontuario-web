export interface PessoaCadastroDTO {
    nome: string;
    cpf: string;
    //sexo: string; // ou 'F' e 'M' para feminino e masculino
    dataNascimento: string; // ou Date, dependendo de como você manipula datas
}