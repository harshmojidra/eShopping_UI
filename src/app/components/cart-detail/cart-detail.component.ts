import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {

  cartProducts: Product[] = [];

  totalBill: number;
  totalQuantity: number;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {

    this.processCartItem();

    // this.productService.cartModified.subscribe(
    //   (products : Product[])=>{
    //     this.cartProducts = products;
    //   }
    // ).unsubscribe();

  }

  processCartItem() {

    // this.cartProducts = null;
    this.cartProducts = this.cartService.getCartProducts();

    this.totalPrice();

    this.totalQuantityCount();

    console.log("Inside cart : Total Quantity : " + this.totalQuantity);

    this.cartService.computeCartTotals();

  }

  totalQuantityCount() {

    this.cartService.totalQuantity.subscribe(data =>
      this.totalQuantity = data
    )

  }


  totalPrice() {

    this.cartService.totalBill.subscribe(data =>
      this.totalBill = data

    )

  }

  incrementQuantity(index: number, product: Product) {

    

    this.cartService.changeQuantity(index, +(1));
    this.cartService.computeCartTotals();
  }

  decrementQuantity(index: number, product: Product) {

    if(product.quantity > 1){

    this.cartService.changeQuantity(index, +(-1));
    this.cartService.computeCartTotals();

    }
    else{
      this.cartService.removeCartItem(index);
      this.cartService.computeCartTotals();
    }

    
  }

  updateQuantity(index: number, qnty: number) {

    console.log("Change at " + index);

    this.cartService.changeQuantity(index, +qnty);
    this.cartService.computeCartTotals();
  }

  removeItem(index : number){
    this.cartService.removeCartItem(index);
    this.cartService.computeCartTotals();
  }

}
