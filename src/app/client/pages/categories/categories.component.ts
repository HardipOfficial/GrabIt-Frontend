import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@shared/models/interfaces';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
    categories: Category[] = [];
    loading = true;

    constructor(
        private categoryService: CategoryService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading categories:', error);
                this.loading = false;
            }
        });
    }

    navigateToProducts(categoryId: string): void {
        this.router.navigate(['/products'], { queryParams: { categoryId } });
    }
}
