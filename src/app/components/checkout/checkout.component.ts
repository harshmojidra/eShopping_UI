import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup;

  totalBill: number = 0;

  totalQuantity: number = 0;

  creaditCardMonth: number[] = [];

  creaditCardYear: number[] = [];

  countries: Country[] = [];

  shippingAdrressStates: State[] = [];

  billingAdrressStates: State[] = [];

  storage : Storage = sessionStorage;


  constructor(private formBuilder: FormBuilder, private formService: ShopFormService,
    private cartService: CartService,private checkoutService : CheckoutService,private route : Router) { }

  ngOnInit(): void {

    //get logged in email
    const theEmail = JSON.parse(this.storage.getItem('userEmail')) ;

    this.checkoutForm = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],
      })
    })

    //get Credir card month

    const startMonth: number = new Date().getMonth();
    console.log("Current Month : " + startMonth);

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creaditCardMonth = data;
      }
    )

    // get credit card year
    this.formService.getCreditCardYears().subscribe(
      data => {
        this.creaditCardYear = data;
        console.log("Cred Years : " + JSON.stringify(data));

      }
    )

    //get countries 

    this.formService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    )

    //get cart details
    this.fetchCartDetails();
  }

  fetchCartDetails() {

    console.log("Cart service call");

    this.cartService.totalBill.subscribe(
      data => {
        this.totalBill = data;
      }
    )

    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    )
  }

  get firstName() {
    return this.checkoutForm.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutForm.get('customer.lastName');
  }

  get email() {
    return this.checkoutForm.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutForm.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutForm.get('shippingAddress.city');
  }

  get shippingAddressState() {
    return this.checkoutForm.get('shippingAddress.state');
  }

  get shippingAddressCountry() {
    return this.checkoutForm.get('shippingAddress.country');
  }

  get shippingAddressZipCode() {
    return this.checkoutForm.get('shippingAddress.zipCode');
  }

  get billingAddressStreet() {
    return this.checkoutForm.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutForm.get('billingAddress.city');
  }

  get billingAddressState() {
    return this.checkoutForm.get('billingAddress.state');
  }

  get billingAddressCountry() {
    return this.checkoutForm.get('billingAddress.country');
  }

  get billingAddressZipCode() {
    return this.checkoutForm.get('billingAddress.zipCode');
  }


  get creditCardType() {
    return this.checkoutForm.get('creditCard.cardType');
  }

  get creditCardNameOnCard() {
    return this.checkoutForm.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutForm.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutForm.get('creditCard.securityCode');
  }

  copyShipToBillAddress(event) {

    console.log("Check boxxx");


    if (event.target.checked) {

      this.checkoutForm.controls.billingAddress.setValue(this.checkoutForm.controls.shippingAddress.value);

      this.billingAdrressStates = this.shippingAdrressStates;
    }
    else {
      this.checkoutForm.controls.billingAddress.reset();

      this.billingAdrressStates = [];
    }

  }

  handleMonthAndYear() {

    const creditCardFormGroup = this.checkoutForm.get('creditCard');

    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup.value.expirationYear);

    console.log("Current Year" + creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(data => {
      this.creaditCardMonth = data;
    })

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutForm.get(formGroupName);

    const countryCode = formGroup.value.country.code;

    console.log("Country Code : " + countryCode);


    this.formService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAdrressStates = data;
        }
        else {
          this.billingAdrressStates = data;
        }

        console.log("States : " + JSON.stringify(data));


        //select first item bydefault
        formGroup.get('state').setValue(data[0]);
      }


    )
  }

  onSubmit() {
    console.log("Form Data : ");
    console.log(this.checkoutForm.value);
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    //set up order
    let order =  new Order();
    order.totalPrice = this.totalBill;
    order.totalQuantity = this.totalQuantity;

    //get cart item
    const cartItem = this.cartService.getCartProducts();

    //create orderItems from cartItem
    let orderItems : OrderItem[] = cartItem.map(theItem=>new OrderItem(theItem));

    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutForm.controls['customer'].value

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutForm.controls['shippingAddress'].value;
    const shippingAddressState : State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
    const shippingAddressCountry : Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country))
    purchase.shippingAddress.state = shippingAddressState.name;
    purchase.shippingAddress.country = shippingAddressCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutForm.controls['billingAddress'].value;
    const billingAddressState : State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
    const billingAddressCountry : Country = JSON.parse(JSON.stringify(purchase.billingAddress.country))
    purchase.billingAddress.state = billingAddressState.name;
    purchase.billingAddress.country = billingAddressCountry.name;

    //populate purchase - order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    console.log("Payload : \n"+JSON.stringify(purchase));
    

    //call REST api from checkout service
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next :  response => {
          console.log("Order placed");
          
          alert("Your Order has been received.\nOrder Tracking number : "+response.orderTrackingNumber)

          //reset cart
          this.resetCart();
        },
        error : err => {
          alert("There is some error "+ err.message);
        }
      }
    )
  
  
  }
  resetCart() {
    
    //reset cart data
    this.cartService.setCartProduct([]);
    this.cartService.totalBill.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    this.checkoutForm.reset();

    //navigate back to product oage
    this.route.navigateByUrl("/products")
  }


}
