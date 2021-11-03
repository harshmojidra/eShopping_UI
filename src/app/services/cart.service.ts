import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _cartProducts: Product[] = [];

  storage: Storage = sessionStorage;
  // storage: Storage = localStorage;

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  totalBill: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {

    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this._cartProducts = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }

  }


  public getCartProducts() {
    return this._cartProducts;
  }

  public setCartProduct(cartItems: Product[]) {
    this._cartProducts = cartItems;
  }

  public changeQuantity(index: number, qnty: number) {


    this._cartProducts[index].quantity += qnty;

    console.log("--Not multiple : After" + this._cartProducts[index].quantity);



    this._cartProducts[index].subTotal = this._cartProducts[index].unitPrice * this._cartProducts[index].quantity;

    console.log("Sub Total : " + this._cartProducts[index].subTotal);

  }

  addToCart(product: Product) {


    let itemExist: boolean = false;

    // check if item exist
    for (var i in this._cartProducts) {

      if (product === this._cartProducts[i]) {
        this.changeQuantity((+i), 1);
        itemExist = true;
        this.computeCartTotals();
        break;
      }
    }

    if (!itemExist) {

      product.quantity = 1;
      product.subTotal = product.unitPrice;
      this._cartProducts.push(product);
      this.computeCartTotals();
    }
  }

  computeCartTotals() {
    this.totalQuantityCount();
    this.totalPrice();

    // persist cart data
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this._cartProducts));
  }

  totalQuantityCount() {
    let totalQuantity = 0;

    for (let product of this._cartProducts) {
      totalQuantity += product.quantity;
    }

    this.totalQuantity.next(totalQuantity);
  }


  totalPrice() {

    let totalBill = 0;

    for (let product of this._cartProducts) {
      totalBill += product.subTotal;
    }

    this.totalBill.next(totalBill);
  }

  removeCartItem(index: number) {
    this._cartProducts.splice(index, 1);
  }

}
