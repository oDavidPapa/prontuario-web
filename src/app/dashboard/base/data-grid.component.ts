import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column } from './column';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Output() edit = new EventEmitter<any>();

  faEdit = faEdit; // Adiciona o ícone de lápis

  constructor(private library: FaIconLibrary) {
    // Adiciona o ícone de edição à biblioteca
    this.library.addIcons(faEdit);
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o ? o[p] : ''), obj);
  }

  onEdit(item: any): void {
    this.edit.emit(item);
  }
}
