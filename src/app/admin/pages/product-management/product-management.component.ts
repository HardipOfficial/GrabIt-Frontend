import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { CategoryService } from '@core/services/category.service';
import { Product, Category } from '@shared/models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-product-management',
    templateUrl: './product-management.component.html',
    styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
    products: Product[] = [];
    categories: Category[] = [];
    loading = true;
    showForm = false;
    editingProduct: Product | null = null;

    productForm: FormGroup;

    displayedColumns: string[] = ['image', 'name', 'category', 'price', 'stock', 'actions'];

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private categoryService: CategoryService,
        private snackBar: MatSnackBar
    ) {
        this.productForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: [0, [Validators.required, Validators.min(0)]],
            category: ['', Validators.required],
            categoryId: ['', Validators.required],
            image: ['', Validators.required],
            stock: [0, [Validators.required, Validators.min(0)]],
            unit: ['pcs']
        });
    }

    ngOnInit(): void {
        this.loadProducts();
        this.loadCategories();
    }

    loadProducts(): void {
        this.productService.getProducts({ page: 1, pageSize: 100 }).subscribe({
            next: (response) => {
                this.products = response.data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (categories) => this.categories = categories
        });
    }

    onCategoryChange(categoryId: string): void {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
            this.productForm.patchValue({ category: category.name });
        }
    }

    showAddForm(): void {
        this.showForm = true;
        this.editingProduct = null;
        this.productForm.reset();
    }

    editProduct(product: Product): void {
        this.showForm = true;
        this.editingProduct = product;
        this.productForm.patchValue(product);
    }

    saveProduct(): void {
        if (this.productForm.valid) {
            const productData = { ...this.productForm.value, inStock: this.productForm.value.stock > 0 };

            if (this.editingProduct) {
                this.productService.updateProduct(this.editingProduct.id, productData).subscribe({
                    next: () => {
                        this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
                        this.loadProducts();
                        this.cancelEdit();
                    },
                    error: () => {
                        this.snackBar.open('Failed to update product', 'Close', { duration: 3000 });
                    }
                });
            } else {
                this.productService.createProduct(productData).subscribe({
                    next: () => {
                        this.snackBar.open('Product added successfully', 'Close', { duration: 3000 });
                        this.loadProducts();
                        this.cancelEdit();
                    },
                    error: () => {
                        this.snackBar.open('Failed to add product', 'Close', { duration: 3000 });
                    }
                });
            }
        }
    }

    deleteProduct(product: Product): void {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            this.productService.deleteProduct(product.id).subscribe({
                next: () => {
                    this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
                    this.loadProducts();
                },
                error: () => {
                    this.snackBar.open('Failed to delete product', 'Close', { duration: 3000 });
                }
            });
        }
    }

    cancelEdit(): void {
        this.showForm = false;
        this.editingProduct = null;
        this.productForm.reset();
    }
}
