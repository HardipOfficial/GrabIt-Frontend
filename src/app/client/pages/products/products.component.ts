import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { CategoryService } from '@core/services/category.service';
import { CartService } from '@core/services/cart.service';
import { Product, Category, ProductFilter } from '@shared/models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];
    categories: Category[] = [];
    loading = true;
    totalProducts = 0;
    pageSize = 12;
    currentPage = 0;

    filter: ProductFilter = {
        page: 1,
        pageSize: 12,
        sortBy: 'name',
        sortOrder: 'asc'
    };

    priceRange = { min: 0, max: 1000 };

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private cartService: CartService,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadCategories();

        // Check for category filter from query params
        this.route.queryParams.subscribe(params => {
            if (params['categoryId']) {
                this.filter.categoryId = params['categoryId'];
            }
            this.loadProducts();
        });
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (categories) => this.categories = categories,
            error: (error) => console.error('Error loading categories:', error)
        });
    }

    loadProducts(): void {
        this.loading = true;
        this.productService.getProducts(this.filter).subscribe({
            next: (response) => {
                this.products = response.data;
                this.totalProducts = response.total;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading products:', error);
                this.loading = false;
            }
        });
    }

    onCategoryChange(categoryId: string): void {
        this.filter.categoryId = categoryId || undefined;
        this.filter.page = 1;
        this.currentPage = 0;
        this.loadProducts();
    }

    onSortChange(sortBy: string): void {
        this.filter.sortBy = sortBy as 'price' | 'name';
        this.loadProducts();
    }

    onPriceRangeChange(): void {
        this.filter.minPrice = this.priceRange.min;
        this.filter.maxPrice = this.priceRange.max;
        this.loadProducts();
    }

    onPageChange(event: PageEvent): void {
        this.filter.page = event.pageIndex + 1;
        this.filter.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadProducts();
    }

    onAddToCart(product: Product): void {
        this.cartService.addToCart(product).subscribe({
            next: () => {
                this.snackBar.open('Added to cart!', 'Close', { duration: 3000 });
            },
            error: () => {
                this.snackBar.open('Login required', 'Close', { duration: 3000 });
            }
        });
    }

    clearFilters(): void {
        this.filter = { page: 1, pageSize: 12, sortBy: 'name', sortOrder: 'asc' };
        this.priceRange = { min: 0, max: 1000 };
        this.loadProducts();
    }
}
