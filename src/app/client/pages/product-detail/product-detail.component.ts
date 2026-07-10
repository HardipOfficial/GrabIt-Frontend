import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';
import { Product } from '@shared/models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
    product: Product | null = null;
    loading = true;
    quantity = 1;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadProduct(id);
        }
    }

    loadProduct(id: string): void {
        this.productService.getProductById(id).subscribe({
            next: (product) => {
                this.product = product;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading product:', error);
                this.loading = false;
            }
        });
    }

    onAddToCart(): void {
        if (this.product) {
            this.cartService.addToCart(this.product, this.quantity).subscribe({
                next: () => {
                    this.snackBar.open(`Added ${this.quantity} item(s) to cart!`, 'Close', { duration: 3000 });
                },
                error: () => {
                    this.snackBar.open('Login required', 'Close', { duration: 3000 });
                }
            });
        }
    }

    increaseQuantity(): void {
        if (this.product && this.quantity < this.product.stock) {
            this.quantity++;
        }
    }

    decreaseQuantity(): void {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }
}
