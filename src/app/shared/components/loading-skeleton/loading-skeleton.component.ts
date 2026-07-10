import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading-skeleton',
    templateUrl: './loading-skeleton.component.html',
    styleUrls: ['./loading-skeleton.component.scss']
})
export class LoadingSkeletonComponent {
    @Input() type: 'product-card' | 'list-item' | 'banner' = 'product-card';
    @Input() count = 1;

    get items(): number[] {
        return Array(this.count).fill(0);
    }
}
