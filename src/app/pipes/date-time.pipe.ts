import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'datetime'
})
export class DatetimePipe implements PipeTransform {

  transform(value: string | Date, format: string = 'dd/MM/yyyy - HH:mm:ss'): string {
    if (!value) return '';
    
    // Garante que a string ISO seja convertida corretamente
    const date = typeof value === 'string' ? new Date(value) : value;

    // Verifica se a data é válida
    if (isNaN(date.getTime())) return value.toString();

    return formatDate(date, format, 'pt-BR');
  }
}