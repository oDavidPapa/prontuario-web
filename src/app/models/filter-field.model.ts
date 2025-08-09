export interface FilterField {
  label: string;
  name: string;
  type: 'text' | 'date' | 'select'; // pode expandir
  options?: { label: string; value: any }[]; // para selects
}
