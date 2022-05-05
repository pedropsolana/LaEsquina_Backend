import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';
import { Category } from '../../models/category';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ICategory } from '../../interfaces/icategory';

@Component({
  selector: 'app-create-categoria',
  templateUrl: './create-categoria.component.html',
  styleUrls: ['./create-categoria.component.css']
})
export class CreateCategoriaComponent implements OnInit { 

  submitted = false;
  loading = false;
  id: number | null;
  titulo = 'Agregar Categoria';
  public imagenes: any[] = [];
  public category: Category[] = [];
  public img: any;
  public nombreImagen: string;
  uploadPercent: Observable<number>;
  createCategoria: FormGroup;


  constructor(
    private fb: FormBuilder,
    private _productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private storage: AngularFireStorage,
    private aRoute: ActivatedRoute) {
    this.createCategoria = this.fb.group({
      nombre: ['', Validators.required],
      id: ['', Validators.required],
      imagen: ['',],
    })
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarEditarCategoria() {
    this.submitted = true;

    if (this.createCategoria.invalid) {
      return;
    }

    if (this.id === null) {
      this.agregarCategoria();
    } else {
      this.editarCategoria(this.id);
    }

  }

  agregarCategoria() {
    const categoria: Category = {
      name: this.createCategoria.value.nombre,
      id: this.createCategoria.value.id,
      img: this.img,
      nomimg: this.nombreImagen,
    }
    this.loading = true;
    this._productService.addCategory(categoria).then(() => {
      this.toastr.success('La Categoria fue registrada con exito!', 'Categoria Registrada', {
        positionClass: 'toast-bottom-right'
      });
      this.loading = false;
      this.router.navigate(['/list-categorias']);
    }).catch(error => {
      console.log(error);
      this.loading = false;
    })
  }


  editarCategoria(id: number) {
    const categoria: Category = {
      name: this.createCategoria.value.nombre,
      id: this.createCategoria.value.id,
      img: this.img,
      nomimg: this.nombreImagen,
    }

    this.loading = true;
    console.log(this.id);
    this._productService.updateCategory(this.id, categoria).then(() => {
      this.loading = false;
      this.toastr.info('La categoria fue modificado con exito', 'Categoria modificada', {
        positionClass: 'toast-bottom-right'
      })
      this.router.navigate(['/list-categorias']);
    })
  }

  async cargarImagen(event: any) {
    const file = event.target.files[0];
    const id = Math.random().toString(36).substring(2);
    const res = await this.subirImagen(file, id);
    console.log(res);
    this.img = res;
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

  esEditar() {
    this.titulo = 'Editar Categoria';
    let categoria : ICategory;
    if (this.id !== null) {
      this.loading = true;
      this._productService.getCategory(this.id).subscribe(data => {
        categoria = data;
        console.log(categoria);
        this.createCategoria.setValue({
                nombre: categoria.name,
                id: categoria.id,
                imagen: "",               
              }  )
        this.img = categoria.img;
      });
    }
  }

}

