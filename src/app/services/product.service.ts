import { IProduct } from './../interfaces/iproduct';
import { ICategory } from './../interfaces/icategory';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
import { Category } from '../models/category';
import { IOrder } from '../interfaces/iorder';
import { Pedidos } from '../interfaces/ipedidos';
import { IUser } from '../interfaces/iuser';


@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private dbPath = '/products';
  private dbPath1 = '/categories';
  private dbPath2 = '/orders';
  private dbPath3 = '/users';
  pedidosRef: AngularFireList<Pedidos> = null;
  ordersRef: AngularFireList<IOrder> = null;
  platosRef: AngularFireList<IProduct> = null;
  catRef: AngularFireList<ICategory> = null;
  userRef: AngularFireList<IUser> = null;

  constructor(
    private afd: AngularFireDatabase,
  ) {
    this.pedidosRef = afd.list(this.dbPath2);
    this.platosRef = afd.list(this.dbPath);
    this.catRef = afd.list(this.dbPath1);
    this.ordersRef = afd.list(this.dbPath2);
    this.userRef = afd.list(this.dbPath3);
  }

  //Obtener todos los pedidos
  getAllOrders(): AngularFireList<Pedidos> {
    // return this.pedidosRef;
    return this.afd.list<Pedidos>('orders', ref => ref.orderByChild('estado'))
  }

  //Obtener los pedidos por dia
  getAllOrdersDay(fecha): AngularFireList<Pedidos> {
    // return this.pedidosRef;
    return this.afd.list<Pedidos>('orders', ref => ref.orderByChild('date').equalTo(fecha))
  }

  //Obtener los pedidos por dia
  getOrdersClie(email): AngularFireList<Pedidos> {
    // return this.pedidosRef;
    return this.afd.list<Pedidos>('orders', ref => ref.orderByChild('email').equalTo(email))
  }

  //Obtener todos los productos
  getAll(): AngularFireList<IProduct> {
    return this.platosRef;
  }

  //Obtener producto por categoria
  getProducts(id: any): AngularFireList<IProduct> {
    console.log(id);
    return this.afd.list<IProduct>('products', ref => ref.orderByChild('idCategory').equalTo(Number(id)));
  }

  //Obtener todas las categorías
  getAllCat(): AngularFireList<ICategory> {
    return this.catRef;
  }

  //Obtener todos los clientes
  getAllClie(): AngularFireList<IUser> {
    return this.userRef;
  }

  //Obtener un producto
  getProduct(id: string) {
    return this.afd.object<IProduct>(`products/${id}`).valueChanges();
  }

  //Obtener una categoria
  getCategory(id: number) {
    return this.afd.object<ICategory>(`categories/${id}`).valueChanges();
  }

  //Obtener datos del cliente
  getCliente(email: string): AngularFireList<IUser> {
    return this.afd.list<IUser>('users', ref => ref.orderByChild('email').equalTo(email));
  }

  //Agregar producto
  addProduct(producto) {
    return this.afd.list<IProduct>('products').push(producto);
  }

  //Agregar categoria
  addCategory(categoria: Category) {
    return this.afd.list<ICategory>('categories').push(categoria);
  }

  //Eliminar producto
  delProduct(id: string): Promise<void> {
    return this.platosRef.remove(id);
  }

  //Eliminar categoria
  delCategory(id: string): Promise<void> {
    return this.catRef.remove(id);
  }

  //Actualizar producto
  updateProduct(id: String, plato: any): Promise<void> {
    return this.afd.object<IProduct>(`products/${id}`).update(plato);
  }

  //Actualizar categoria
  updateCategory(id: number, categoria: any): Promise<void> {
    return this.afd.object<ICategory>(`categories/${id}`).update(categoria);
  }

  //Actualiza pedido
  updatePedido(id: string, pedido: any) {
    return this.afd.object<Pedidos>(`orders/${id}`).update(pedido);
  }


} 
