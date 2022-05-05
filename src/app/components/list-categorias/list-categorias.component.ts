import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../../models/category';
import { AngularFireStorage } from '@angular/fire/storage';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-list-categorias',
  templateUrl: './list-categorias.component.html',
  styleUrls: ['./list-categorias.component.css']
})
export class ListCategoriasComponent implements OnInit {

  // productos a mostrar
  public products: Product[] = [];
  public category: Category[] = [];
  public url: Observable<string | null>;
  public longitud: number;
  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private storage: AngularFireStorage,
    private notificaciones: NotificationsService
  ) { }


  ngOnInit(): void {
    this.recogerCategorias();
  }

  
  recogerCategorias() {
    // Recojo las Categorias
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

  eliminarCategoria(id: string, key: string, nomimg: string) {

    //Mirar si la categoria tiene productos no se podrá eliminar
    this.productService.getProducts(Number(id)).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.products = data;
      this.longitud = this.products.length.valueOf();
      if ( this.longitud > 0) {
        this.toastr.error('La categoria no se puede eliminar', 'Contiene platos!', {
          positionClass: 'toast-bottom-right'
        });
  
      } else {
        // Borra imagen del Storage
        const filePath = `uploads/${nomimg}`;
        const ref = this.storage.ref(filePath);
        ref.delete().subscribe(() => {
          console.log("Borrado");
        })
  
        // Borra la entrada en la base de datos
        this.productService.delCategory(key).then(() => {
          console.log('categoria eliminado con exito');
          this.toastr.error('La categoria fue eliminada con exito', 'Registro eliminado!', {
            positionClass: 'toast-bottom-right'
          });
        }).catch(error => {
          console.log(error);
        })
      }
    });
    console.log(id);
  }




}
