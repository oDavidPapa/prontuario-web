import { Component, Input } from '@angular/core';
import { Column } from './column';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o ? o[p] : ''), obj);
  }
}
