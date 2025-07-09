import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column } from './column';
import { faEdit, faTrash, faTimesCircle, faCheckCircle, faToggleOn, faToggleOff  } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() showEdit: boolean = true; // Adiciona esta propriedade para controle de exibição do botão de editar
  @Input() showDelete: boolean = true; // Adiciona esta propriedade para controle de exibição do botão de deletar
  @Input() showToggle: boolean = false; // Controle de exibição do botão de toggle (ativar/desativar)

  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>(); // Emissor para remoção
  @Output() toggleStatus = new EventEmitter<any>(); // Emissor para alterar status


  faEdit = faEdit; // Adiciona o ícone de lápis
  faTrash = faTrash; // Adiciona o ícone de lixeira
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;

  faToggleOn = faToggleOn; // Ícone de toggle ligado
  faToggleOff = faToggleOff; // Ícone de toggle desligado



  constructor(private library: FaIconLibrary) {
    // Adiciona os ícones à biblioteca
    this.library.addIcons(faEdit, faTrash, faTimesCircle, faCheckCircle, faToggleOn, faToggleOff);
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o ? o[p] : ''), obj);
  }

  onEdit(item: any): void {
    this.edit.emit(item);
  }

  onRemove(item: any): void {
    this.remove.emit(item); // Emite o item para remoção
  }
  
  onToggleStatus(item: any): void {
    this.toggleStatus.emit(item);
  }
}
