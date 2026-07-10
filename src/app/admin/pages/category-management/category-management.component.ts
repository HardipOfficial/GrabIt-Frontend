import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@shared/models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-category-management',
    templateUrl: './category-management.component.html',
    styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
    categories: Category[] = [];
    loading = true;
    showForm = false;
    editingCategory: Category | null = null;

    categoryForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private categoryService: CategoryService,
        private snackBar: MatSnackBar
    ) {
        this.categoryForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            image: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    showAddForm(): void {
        this.showForm = true;
        this.editingCategory = null;
        this.categoryForm.reset();
    }

    editCategory(category: Category): void {
        this.showForm = true;
        this.editingCategory = category;
        this.categoryForm.patchValue(category);
    }

    saveCategory(): void {
        if (this.categoryForm.valid) {
            if (this.editingCategory) {
                this.categoryService.updateCategory(this.editingCategory.id, this.categoryForm.value).subscribe({
                    next: () => {
                        this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 });
                        this.loadCategories();
                        this.cancelEdit();
                    }
                });
            } else {
                this.categoryService.createCategory(this.categoryForm.value).subscribe({
                    next: () => {
                        this.snackBar.open('Category added successfully', 'Close', { duration: 3000 });
                        this.loadCategories();
                        this.cancelEdit();
                    }
                });
            }
        }
    }

    deleteCategory(category: Category): void {
        if (confirm(`Delete "${category.name}"?`)) {
            this.categoryService.deleteCategory(category.id).subscribe({
                next: () => {
                    this.snackBar.open('Category deleted', 'Close', { duration: 3000 });
                    this.loadCategories();
                }
            });
        }
    }

    cancelEdit(): void {
        this.showForm = false;
        this.editingCategory = null;
        this.categoryForm.reset();
    }
}
