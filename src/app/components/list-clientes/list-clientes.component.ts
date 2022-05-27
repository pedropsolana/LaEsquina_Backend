import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { IUser } from 'src/app/interfaces/iuser';
import { Pedidos } from '../../interfaces/ipedidos';

@Component({
  selector: 'app-list-clientes',
  templateUrl: './list-clientes.component.html',
  styleUrls: ['./list-clientes.component.css']
})
export class ListClientesComponent implements OnInit {

  public clientes: IUser[] = [];
  public pedidos: Pedidos[] =[];
  public cliente: string;
  
  constructor(
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.recogerClientes();
  }
  displayStyle = "none";

  openPopup(email: string, nombre: string, apellidos: string) {
    this.recogerDatosPedidos(email);
    this.displayStyle = "block";
    this.cliente= nombre+" "+apellidos;
  }
  
  closePopup() {
    this.displayStyle = "none";
  }

  recogerClientes() {
    // Recojo los Clientes
    this.productService.getAllClie().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.clientes = data;
    });
  }

  recogerDatosPedidos(email: string) {
    // Recojo los Pedidos del Cliente
    this.productService.getOrdersClie(email).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.pedidos = data;
    });
  }
}
