export interface Column {
    header: string;
    field: string;
    format?: 'cpf' | 'date' | 'celular' | 'telefone' | 'status'; // Adiciona a opção de formatação
  }
  