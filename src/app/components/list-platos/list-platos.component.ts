import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../../models/category';
import { AngularFireStorage } from '@angular/fire/storage'; 

@Component({
  selector: 'app-list-platos',
  templateUrl: './list-platos.component.html',
  styleUrls: ['./list-platos.component.css']
})
export class ListPlatosComponent implements OnInit {


  // productos a mostrar
  public products: Product[] = [];
  public category: Category[] = [];
  public url: Observable<string | null>;
  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private storage: AngularFireStorage,
  ) { }


  ngOnInit(): void {
    this.recogerCategorias();
    this.recogerPlatos(99);
  }

  recogerPlatos(id: any) {
    console.log(id);
    // Recojo los productos
    if (id == 99) {
      this.productService.getAll().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        this.products = data;
      });
    } else {
      this.productService.getProducts(id).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        this.products = data;
      });
      
    }
  }

  recogerCategorias() {
    // Recojo los productos
    this.productService.getAllCat().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.category = data;
    });
  }

  eliminarPlato(id: string, nomimg: string) {
    
    // Borra imagen del Storage
    const filePath = `uploads/${nomimg}`;
    const ref = this.storage.ref(filePath);
    ref.delete().subscribe(() => {
      console.log("Borrado");
    })

    // Borra la entrada en la base de datos
    this.productService.delProduct(id).then(() => {
      console.log('plato eliminado con exito');
      this.toastr.error('El plato fue eliminado con exito', 'Registro eliminado!', {
        positionClass: 'toast-bottom-right'
      });
    }).catch(error => {
      console.log(error);
    })
  }

}
