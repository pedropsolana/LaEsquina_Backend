import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCategoriaComponent } from './components/create-categoria/create-categoria.component';
import { ListCategoriasComponent } from './components/list-categorias/list-categorias.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { ListPlatosComponent } from './components/list-platos/list-platos.component';
import { CreatePlatosComponent } from './components/create-platos/create-platos.component';
import { ListClientesComponent } from './components/list-clientes/list-clientes.component';

const routes: Routes = [
  { path: '', redirectTo: 'pedidos', pathMatch: 'full' },
  { path: 'list-platos', component: ListPlatosComponent },
  { path: 'create-platos', component: CreatePlatosComponent },
  { path: 'editPlatos/:id', component: CreatePlatosComponent },
  { path: 'list-categorias', component: ListCategoriasComponent },
  { path: 'create-categoria', component: CreateCategoriaComponent },
  { path: 'editCategoria/:id', component: CreateCategoriaComponent },
  { path: 'list-clientes', component: ListClientesComponent},
  { path: 'pedidos', component: PedidosComponent },  
  { path: '**', redirectTo: 'pedidos', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
