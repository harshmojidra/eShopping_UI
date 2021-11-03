import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalQuantity:number = 0;
  totalBill : number = 0;

  constructor(private cartService : CartService) { }

  ngOnInit(): void {

    this.cartService.totalBill.subscribe(data=>{
      this.totalBill = data;
    })

    this.cartService.totalQuantity.subscribe(data=>{
      this.totalQuantity = data;
    })
  }

}
