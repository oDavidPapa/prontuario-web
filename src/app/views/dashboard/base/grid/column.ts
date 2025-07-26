export interface Column {
  header: string;
  field: string;
  format?: 'cpf' | 'date' | 'celular' | 'telefone' | 'status' | 'ditetime'; // Adiciona a opção de formatação
  align?: 'left' | 'center' | 'right'; // Alinhamento opcional (padrão será 'left')
}
