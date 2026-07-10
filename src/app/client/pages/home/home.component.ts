import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { CategoryService } from '@core/services/category.service';
import { CartService } from '@core/services/cart.service';
import { Product, Category } from '@shared/models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    featuredProducts: Product[] = [];
    categories: Category[] = [];
    loading = true;
    loadingProducts = true;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private cartService: CartService,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCategories();
        this.loadFeaturedProducts();
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories.slice(0, 6); // Show first 6 categories
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading categories:', error);
                this.loading = false;
            }
        });
    }

    loadFeaturedProducts(): void {
        this.productService.getFeaturedProducts().subscribe({
            next: (products) => {
                this.featuredProducts = products;
                this.loadingProducts = false;
            },
            error: (error) => {
                console.error('Error loading products:', error);
                this.loadingProducts = false;
            }
        });
    }

    onAddToCart(product: Product): void {
        this.cartService.addToCart(product).subscribe({
            next: () => {
                this.snackBar.open('Product added to cart!', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'end',
                    verticalPosition: 'top'
                });
            },
            error: (error) => {
                this.snackBar.open('Failed to add product to cart', 'Close', {
                    duration: 3000
                });
            }
        });
    }

    navigateToCategory(categoryId: string): void {
        this.router.navigate(['/products'], { queryParams: { categoryId } });
    }
}
