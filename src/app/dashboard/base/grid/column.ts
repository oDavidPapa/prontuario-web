export interface Column {
    header: string;
    field: string;
    format?: 'cpf' | 'date' | 'celular' | 'telefone'; // Adiciona a opção de formatação
  }
  