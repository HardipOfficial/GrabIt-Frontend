import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-empty-state',
    templateUrl: './empty-state.component.html',
    styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
    @Input() icon = 'inbox';
    @Input() title = 'No items found';
    @Input() message = 'There are no items to display at the moment.';
    @Input() actionText?: string;
    @Input() actionRoute?: string;
}
