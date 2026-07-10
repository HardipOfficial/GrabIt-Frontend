import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { Product, CartItem } from '@shared/models/interfaces';

describe('CartService', () => {
    let service: CartService;
    let httpMock: HttpTestingController;

    const mockProduct: Product = {
        id: 'p1',
        name: 'Apple',
        price: 2.0,
        description: 'Fresh',
        category: 'Fruits',
        categoryId: 'c1',
        image: 'apple.png',
        stock: 100,
        inStock: true
    };

    const mockCartItem: CartItem = {
        id: 'ci1',
        product: mockProduct,
        quantity: 2,
        subtotal: 4.0
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CartService]
        });
        service = TestBed.inject(CartService);
        httpMock = TestBed.inject(HttpTestingController);

        // Handle immediate loadCart() call in constructor
        const req = httpMock.expectOne('/api/cart');
        req.flush([]);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add item to cart via API and reload', () => {
        service.addToCart(mockProduct, 2).subscribe(response => {
            expect(response.success).toBeTrue();
        });

        const postReq = httpMock.expectOne('/api/cart');
        expect(postReq.request.method).toBe('POST');
        expect(postReq.request.body).toEqual({ productId: 'p1', quantity: 2 });
        postReq.flush({ success: true, data: mockCartItem });

        const getReq = httpMock.expectOne('/api/cart');
        expect(getReq.request.method).toBe('GET');
        getReq.flush([mockCartItem]);
    });

    it('should call DELETE /api/cart/:id and reload cart', () => {
        service.removeFromCart('ci1').subscribe(response => {
            expect(response.success).toBeTrue();
        });

        const deleteReq = httpMock.expectOne('/api/cart/ci1');
        expect(deleteReq.request.method).toBe('DELETE');
        deleteReq.flush({ success: true });

        const getReq = httpMock.expectOne('/api/cart');
        expect(getReq.request.method).toBe('GET');
        getReq.flush([]);
    });
});
