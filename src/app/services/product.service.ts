import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _cartProducts: Product[] = [];

  cartModified = new Subject<Product[]>();

  public setcartProducts(product: Product) {
    product.quantity=1;
    product.subTotal=product.unitPrice;
    this._cartProducts.push(product);
  }

  public getCartProducts(){
    return this._cartProducts;
  }

  public changeQuantity(index : number , qnty : number){
    
    this._cartProducts[index].quantity=qnty;

    this._cartProducts[index].subTotal= this._cartProducts[index].unitPrice * qnty;

    this.cartModified.next(this._cartProducts);
  }

  private baseUrl = environment.baseUrl;

  constructor(private http : HttpClient) { }

  getProductList(categoryId : number) : Observable<Product[]> 
  {
    const searchUrl=`${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl)
  }

  getProductListPaginate(pageNumber : number ,pageSize : number, categoryId : number) : Observable<GetProductResponse> 
  {
    const searchUrl=`${this.baseUrl}/products/search/findByCategoryId?id=${categoryId}
                      &page=${pageNumber}&size=${pageSize}`;

    return this.http.get<GetProductResponse>(searchUrl);
  }

  

  getProductCategoryList() : Observable<ProductCategory[]> 
  {

    return this.http.get<GetProductCategoryResponse>(this.baseUrl + "/product-category").pipe(
      map((response)=>response._embedded.productCategory
      )
    )
  }

  getProductByName(searchedProduct: string) {

    const searchUrl=`${this.baseUrl}/products/search/findByNameContaining?name=${searchedProduct}`;

    return this.getProducts(searchUrl);
  } 

  getProductByNamePagination(pageNumber : number ,pageSize : number,searchedProduct: string){

    const searchUrl=`${this.baseUrl}/products/search/findByNameContaining?name=${searchedProduct}&page=${pageNumber}&size=${pageSize}`;

    return this.http.get<GetProductResponse>(searchUrl);
  } 

  getProductById(productId: number) : Observable<Product> {
    const searchUrl=`${this.baseUrl}/products/${productId}`;

    return this.http.get<Product>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.http.get<GetProductResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  

  
}

interface GetProductResponse{
  _embedded:{
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number:number
    }
}

interface GetProductCategoryResponse{
  _embedded:{
    productCategory : ProductCategory[];
  }
}



