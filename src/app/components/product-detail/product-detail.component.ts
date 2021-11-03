import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  productId: number;
  product: Product = new Product();

  constructor(private route: ActivatedRoute, private productService: ProductService,
              private cartService : CartService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      () => {
        this.handleSelectedProduct();
      }
    );


  }


  private handleSelectedProduct() {
    this.productId = +this.route.snapshot.paramMap.get('id');

    console.log('Id : ' + this.productId);

    this.productService.getProductById(this.productId).subscribe(data => {
      this.product = data;
    });

    console.log(this.product);
  }

  addToCart(product:Product){

    this.cartService.addToCart(product);

  }
}
