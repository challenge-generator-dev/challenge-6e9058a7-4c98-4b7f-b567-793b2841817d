import { Routes } from '@angular/router';
import { OrdersComponent } from './features/orders/orders.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrdersComponent,
    title: 'Gestión de Órdenes - Dashboard'
  },
  {
    path: 'orders/:id',
    component: OrdersComponent,
    title: 'Detalle de Orden'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];