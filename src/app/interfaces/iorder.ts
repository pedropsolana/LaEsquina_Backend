import { Product } from './../models/product';
export interface IOrder {
    productsOrder: Product[],
    name: string,
    telf: string,
    address: string,
    estado: string,
    date: string,
    time: string,
    addProduct,
    oneMoreProduct,
    oneLessProduct,
    removeProduct,
    numProducts,
    totalOrder   
}
