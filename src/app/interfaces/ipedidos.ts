import { Product } from '../models/product';
export interface Pedidos {
    products: Product[],
    name: string,
    email: string
    telf: string,
    estado: string,
    priceOrder: string,
    date: string,
    time: string,
    token: string,
}