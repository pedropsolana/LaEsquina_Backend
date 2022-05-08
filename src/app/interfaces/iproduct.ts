export interface IProduct {
    $key: string;
    name: string;
    img: string;
    nomimg: string;
    price: number;
    idCategory: number;
    quantity: number;
    showDetail: boolean;
    extras: any[];
    totalPrice
}
