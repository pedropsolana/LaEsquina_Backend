import { IProduct } from './../interfaces/iproduct';
import { set, get, forEach } from 'lodash-es';

export class Product implements IProduct {

    constructor(data) {
        set(this, 'data', data);
    }
    $key: string;

    nomimg: string;

    get price() {
        return get(this, 'data.price');
    }

    set price(value: number){
        set(this,'data.price', value)
    }

    get extras() {
        return get(this, 'data.extras');
    }

    get name() {
        return get(this, 'data.name');
    }

    set name(value: string){
        set(this,'data.name', value)
    }

    get img() {
        return get(this, 'data.img');
    }

    set img(value: string){
        set(this,'data.img', value)
    }

    get idCategory() {
        return get(this, 'data.idCategory');
    }

    set idCategory(value: number){
        set(this,'data.idCategory', value)
    }

    get showDetail() {
        return get(this, 'data.showDetail');
    }

    set showDetail(value: boolean) {
        set(this, 'data.showDetail', value);
    }

    get quantity() {
        return get(this, 'data.quantity');
    }

    set quantity(value: number) {
        set(this, 'data.quantity', value);
    }

    /**
     * Devuelve los extras de un producto
     */
     getExtras() {

        const extras = [];

        // Recorro los extras
        forEach(this.extras, extra => {
            const products = extra.products;
            // Recorro los productos
            forEach(products, product => {

                // varias opciones
                if (product.optionSelected) {
                    extras.push(
                        {
                            "name": product.name,
                            "selected": product.optionSelected.name
                        }
                    );
                    // solo una opcion
                } else if (product.options[0].activate) {
                    extras.push(
                        {
                            "name": product.name
                        }
                    );
                }

            });
        });

        return extras;
    }

    /**
     * Total del producto
     */
    totalPrice() {

        let total = this.price;

        // recorremos los extras
        forEach(this.extras, extra => {
            const products = extra.products;
            // recorremos los productos
            forEach(products, product => {
                // Si tiene varias opciones
                if (product.optionSelected) {
                    total += product.optionSelected.price;
                    // Si tiene solo una opcion
                } else if (product.options[0].activate) {
                    total += product.options[0].price;
                }
            });
        });

        return total;
    }

}
