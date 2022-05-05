import { ICategory } from './../interfaces/icategory';
import { set, get } from 'lodash-es';

export class Category implements ICategory{

    constructor(data) {
        set(this, 'data', data);
    }
    nomimg: string;

    get id(){
        return get(this, 'data.id');
    }
    
    get name(){
        return get(this, 'data.name');
    }

    get img(){
        return get(this, 'data.img');
    }

}
