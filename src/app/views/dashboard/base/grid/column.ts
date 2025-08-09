export interface Column {
  header: string;
  field: string;
  format?: 'cpf' | 'date' | 'celular' | 'telefone' | 'status' | 'ditetime'; 
  align?: 'left' | 'center' | 'right'; 
}
