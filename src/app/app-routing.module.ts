import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { CartDetailComponent } from './components/cart-detail/cart-detail.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { MemberPageComponent } from './components/member-page/member-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';

const routes: Routes = [

  {path: 'order-history', component: OrderHistoryComponent , canActivate : [OktaAuthGuard]},
  {path: 'members', component: MemberPageComponent , canActivate : [OktaAuthGuard]},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path:'search/:name', component : ProductListComponent},
  {path:'category/:id', component : ProductListComponent},
  {path:'category', component : ProductListComponent},
  {path:'checkout', component : CheckoutComponent},
  {path:'products', component : ProductListComponent},
  {path:'cart-detail', component : CartDetailComponent},
  {path:'product/:id', component : ProductDetailComponent},
  {path:'', redirectTo : '/products' , pathMatch : 'full'},
  {path:'**', redirectTo : '/products' , pathMatch : 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
