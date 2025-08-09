import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterField } from '../../../../models/filter-field.model';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
})
export class FilterComponent {
    @Input() fields: FilterField[] = [];
    @Output() filterChange = new EventEmitter<any>();

    filterValues: { [key: string]: any } = {};

    applyFilter() {
        this.filterChange.emit(this.filterValues);
    }

    clearFilter() {
        this.filterValues = {};
        this.filterChange.emit(this.filterValues);
    }
}
