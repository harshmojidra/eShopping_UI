import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  searchedProduct: string = null;
  previousSearchedProduct: string = null;

  products: Product[] = [];

  pageNumber: number = 1;
  pageSize: number = 10;
  totalElement: number = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute, 
              private cartService: CartService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();

  }

  listProducts() {

    if (this.previousSearchedProduct !== this.searchedProduct) {
      this.pageNumber = 1;
    }
    this.previousSearchedProduct = this.searchedProduct;

    //check if  "id parameter is availble"
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    //check if  "name parameter is availble"
    const isProductSerached: boolean = this.route.snapshot.paramMap.has('name');


    if (isProductSerached) {

      this.searchedProduct = this.route.snapshot.paramMap.get('name');

      this.productService.getProductByNamePagination(this.pageNumber - 1, this.pageSize, this.searchedProduct).subscribe(
        this.processResult()
      )

    }
    else {
      if (hasCategoryId) {
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      }
      else {

        //not category id then default category id is 1
        this.currentCategoryId = 1;

      }

      if (this.currentCategoryId !== this.previousCategoryId) {
        this.pageNumber = 1;
      }
      this.previousCategoryId = this.currentCategoryId;

      console.log(`Current Category Id = ${this.currentCategoryId} & Page Number = ${this.pageNumber}`);



      //get the products based on product category
      this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId).subscribe(
        this.processResult()
      )
    }
  }

  processResult() {
    return data => {

      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElement = data.page.totalElements;

    }
  }

  addToCart(product: Product) {

    this.cartService.addToCart(product);

  }

}
