import { Product } from './product';
import { IOrder } from './../interfaces/iorder';

import { set, get, find, cloneDeep, unset, isEqual, remove, forEach } from 'lodash-es';

export class Order implements IOrder {

    constructor(data) {
        set(this, 'data', data);
        this.productsOrder = [];
    }
    date: string;
    time: string;
    estado: string;

    get productsOrder(): Product[] {
        return get(this, 'data.productsOrder');
    }

    set productsOrder(value: Product[]) {
        set(this, 'data.productsOrder', value);
    }


    get name(): string {
        return get(this, 'data.name');
    }

    set name(value: string) {
        set(this, 'data.name', value);
    }

    get telf(): string {
        return get(this, 'data.telf');
    }

    set telf(value: string) {
        set(this, 'data.telf', value);
    }

    get address(): string {
        return get(this, 'data.address');
    }

    set address(value: string) {
        set(this, 'data.address', value);
    }

    addProduct(product: Product) {

        console.log("product ", product);
        const productFound: Product = find(this.productsOrder, p => {
            let copy = cloneDeep(p);
            unset(copy, 'data.quantity');
            return isEqual(copy, product);
        })

        if (productFound) {
            productFound.quantity++;
        } else {
            product.quantity = 1;
            this.productsOrder.push(product);
        }


    }


    oneMoreProduct(product: Product) {
        product.quantity++;
    }

    oneLessProduct(product: Product) {
        product.quantity--;
        if (product.quantity == 0) {
            this.removeProduct(product);
        }
    }

    removeProduct(product: Product) {
        remove(this.productsOrder, p => {
            return isEqual(p, product);
        })
    }

    numProducts() {
        return this.productsOrder.length;
    }

    totalOrder() {

        let total = 0;

        forEach(this.productsOrder, p => {
            total += p.totalPrice() * p.quantity
        })

        return total.toFixed(2);
    }


}
