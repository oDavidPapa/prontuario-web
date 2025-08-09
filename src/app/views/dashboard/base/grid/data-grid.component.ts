import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column } from './column';
import { faEdit, faTrash, faTimesCircle, faCheckCircle, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { CustomButtonGrid } from './custom-button-grid.model';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() showEdit: boolean = true; 
  @Input() showDelete: boolean = true; 
  @Input() showToggle: boolean = false; 
  @Input() iconButtons: CustomButtonGrid[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>(); 
  @Output() toggleStatus = new EventEmitter<any>(); 
  @Output() iconButtonClick = new EventEmitter<{ actionName: string, item: any }>();


  faEdit = faEdit; 
  faTrash = faTrash; 
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;

  faToggleOn = faToggleOn; 
  faToggleOff = faToggleOff; 



  constructor(private library: FaIconLibrary) {
    this.library.addIcons(faEdit, faTrash, faTimesCircle, faCheckCircle, faToggleOn, faToggleOff);
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o ? o[p] : ''), obj);
  }

  onEdit(item: any): void {
    this.edit.emit(item);
  }

  onRemove(item: any): void {
    this.remove.emit(item); 
  }

  onToggleStatus(item: any): void {
    this.toggleStatus.emit(item);
  }

  onIconButtonClick(actionName: string, item: any) {
    this.iconButtonClick.emit({ actionName, item });
  }
}
