import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Modulos
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


// Componentes
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { environment } from 'src/environments/environment';
import { ListCategoriasComponent } from './components/list-categorias/list-categorias.component';
import { CreateCategoriaComponent } from './components/create-categoria/create-categoria.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { ListPlatosComponent } from './components/list-platos/list-platos.component';
import { CreatePlatosComponent } from './components/create-platos/create-platos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListClientesComponent } from './components/list-clientes/list-clientes.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListCategoriasComponent,
    CreateCategoriaComponent,
    PedidosComponent,
    ListPlatosComponent,
    CreatePlatosComponent,
    ListClientesComponent,
   ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
