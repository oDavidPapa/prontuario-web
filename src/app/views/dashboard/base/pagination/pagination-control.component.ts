import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-pagination-control',
    templateUrl: './pagination-control.component.html',
    styleUrls: ['./pagination-control.component.css']
})
export class PaginationControlComponent {
    @Input() page: number = 1;
    @Input() totalPages: number = 1;

    @Output() pageChange = new EventEmitter<number>();

    previousPage(): void {
        if (this.page > 1) this.pageChange.emit(this.page - 1);
    }

    nextPage(): void {
        if (this.page < this.totalPages) this.pageChange.emit(this.page + 1);
    }
}
