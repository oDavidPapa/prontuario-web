import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneMask'
})
export class PhoneMaskPipe implements PipeTransform {

  transform(value: string, type: 'telefone' | 'celular' = 'telefone'): string {
    if (!value) return '';

    // Remove caracteres não numéricos
    const digits = value.replace(/\D/g, '');

    // Formata conforme o tipo especificado
    if (type === 'celular') {
      return this.formatCelular(digits);
    } else {
      return this.formatTelefone(digits);
    }
  }

  private formatCelular(digits: string): string {
    if (digits.length <= 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return digits;
  }

  private formatTelefone(digits: string): string {
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return digits;
  }
}
