import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { Platos } from 'src/app/interfaces/iplatos';
import { Category } from '../../models/category';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IProduct } from '../../interfaces/iproduct';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-platos',
  templateUrl: './create-platos.component.html',
  styleUrls: ['./create-platos.component.css']
})
export class CreatePlatosComponent implements OnInit {

  createEmpleado: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Agregar Plato';
  public imagenes: any[] = [];
  public category: Category[] = [];
  public img: any;
  public nombreImagen: string | null;
  uploadPercent: Observable<number>;


  constructor(private fb: FormBuilder,
    private _productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private storage: AngularFireStorage,
    private aRoute: ActivatedRoute) {
    this.createEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      imagen: ['',],
      pvp: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.recogerCategorias();
    this.esEditar();
  }

  agregarEditarProducto() {
    this.submitted = true;

    if (this.createEmpleado.invalid) {
      return;
    }

    if (this.id === null) {
      this.agregarProducto();
    } else {
      this.editarProducto(this.id);
    }

  }

  agregarProducto() {
    const producto: Platos = {
      name: this.createEmpleado.value.nombre,
      idCategory: Number(this.createEmpleado.value.categoria),
      img: this.img,
      nomimg: this.nombreImagen,
      price: this.createEmpleado.value.pvp,
    }
    this.loading = true;
    this._productService.addProduct(producto).then(() => {
      this.toastr.success('El plato fue registrado con exito!', 'Plato Registrado', {
        positionClass: 'toast-bottom-right'
      });
      this.loading = false;
      this.router.navigate(['/list-empleados']);
    }).catch(error => {
      console.log(error);
      this.loading = false;
    })
  }
  recogerCategorias() {
    // Recojo los productos
    this._productService.getAllCat().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.category = data;
    });
  }

  editarProducto(id: string) { 
    const producto: Platos = {
      name: this.createEmpleado.value.nombre,
      idCategory: this.createEmpleado.value.categoria,
      img: this.img,
      nomimg: this.nombreImagen,
      price: this.createEmpleado.value.pvp,
    }

    this.loading = true;
    console.log(this.id);
    this._productService.updateProduct(id, producto).then(() => {
      this.loading = false;
      this.toastr.info('El plato fue modificado con exito', 'Plato modificado', {
        positionClass: 'toast-bottom-right'
      })
      this.router.navigate(['/list-empleados']);
    })
  }

  async cargarImagen(event: any) {
    const file = event.target.files[0];
    const nombreAleatorio = Math.random().toString(36).substring(2);
    const url = await this.subirImagen(file, nombreAleatorio);
    console.log(url);
    this.img = url;
  }

  subirImagen(file: any, nombre: string): Promise<string> {
    return new Promise(resolve => {
      const filePath = `uploads/imagen_${nombre}`; 
      this.nombreImagen = `imagen_${nombre}`;
      const ref = this.storage.ref(filePath);
      const task = ref.put(file);
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(res => {
            const urlImage = res;
            resolve(urlImage);
            return;
          })
        })
      ).subscribe();
    });
  }

  eliminarImagen() {
    if (this.nombreImagen != null) {
      const filePath = `uploads/${this.nombreImagen}`;
      const ref = this.storage.ref(filePath);
      console.log(this.nombreImagen);

      // Borra imagen del Storage
      ref.delete().subscribe(() => {
        console.log("Borrado");
      })
    }
  }


  esEditar() {
    this.titulo = 'Editar Producto';
    let producto: IProduct;
    if (this.id !== null) {
      this.loading = true;
      this._productService.getProduct(this.id).subscribe(data => {
        producto = data;
        console.log(producto);
        this.createEmpleado.setValue({
          nombre: producto.name,
          categoria: producto.idCategory,
          pvp: producto.price,
          imagen: "",
        })
        this.img = producto.img;
      });
    }
  }

}
