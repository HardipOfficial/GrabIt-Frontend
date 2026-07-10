import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@shared/models/interfaces';

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
    @Input() product!: Product;
    @Output() addToCart = new EventEmitter<Product>();

    onAddToCart(): void {
        this.addToCart.emit(this.product);
    }
}
