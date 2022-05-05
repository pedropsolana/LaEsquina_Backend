import { Observable } from 'rxjs';
export interface Platos {
    name: string;
    img: Observable<string | null>;
    nomimg: string;
    price: number;
    idCategory: number;
}