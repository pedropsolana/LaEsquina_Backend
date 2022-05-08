import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { Pedidos } from 'src/app/interfaces/ipedidos';
import { NotificationsService } from 'src/app/services/notifications.service';
import { IUser } from 'src/app/interfaces/iuser';
import _ from "lodash";
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { EmailValidator } from '@angular/forms';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})

export class PedidosComponent implements OnInit {

  // productos a mostrar
  public orders: Pedidos[] = [];
  public cliente: IUser[] = [];
  public platos: Product[] = [];
  public url: Observable<string | null>;
  public dateObj: Date | null;
 

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private enviaNotif: NotificationsService,
  ) { }


  ngOnInit(): void {
    this.recogerOrders();
  }

  displayStyle = "none";
  
  openPopup(email) {
    this.recogerDatosCliente(email);
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

  recogerOrders() {

    // Recojo los pedidos
    this.productService.getAllOrders().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.orders = data;
      // console.log(this.orders);
      // console.log(_.orderBy(this.orders, ['estado','date', 'time'], ['asc', 'desc', 'desc']));
      this.orders =_.orderBy(this.orders, ['estado','date', 'time'], ['asc', 'desc', 'desc']); // Ordenamos coleccion con lodash
      console.log("Pedidos:", this.orders);
    });
  }

  recogerDatosCliente(email: string) {

    // Recojo el cliente
    this.productService.getCliente(email).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.cliente = data;
      console.log(this.cliente);
    });
    
  }

  recogerOrdersporDia(fecha: string) {
    if (fecha === "") {
      this.recogerOrders();
    } else {
     
      // Convierto la fecha de salida del datepicker en formato dd-mm-aaa
      let dia, anio, mes, fechaValida;
      dia = fecha.substring(8,10);
      mes = fecha.substring(5,7);
      anio = fecha.substring(0,4);
      fechaValida = dia + "-" + mes + "-" + anio;
     // console.log(fecha);
     // console.log(fechaValida);

      // Recojo los pedidos por Dia
      this.productService.getAllOrdersDay(fechaValida).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        this.orders = data;
        console.log(this.orders);
      });
    }

  }

  cambiaEstado(key: string, email: string, nombre: string, estado: string, total: string, telefono: string, fecha: string, hora: string, productos: [], token: string) {

    // Cambia el estado y envia notificacion.
    let cambioEstado: string;
    console.log("Estado:", estado, "Token", token);

    this.enviaNotif.sendPostRequest(estado, token);
    if (estado === '1') {
      cambioEstado = '2';
    } else if (estado === '2') {
      cambioEstado = '3';
    }

    // Crea el objeto con el estado modificado
    const pedido: Pedidos = {
      name: nombre,
      telf: telefono,
      email: email,
      estado: cambioEstado,
      priceOrder: total, 
      date: fecha,
      time: hora,
      products: productos,
      token: token,
    }

    // Actualiza el objeto en Firebase
    this.productService.updatePedido(key, pedido).then(
      (response) => {
        this.recogerOrders();
      }).catch((error) => {
        console.log(error);
      }
      );
  }
  
}


