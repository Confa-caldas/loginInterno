import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthenticationService } from '../servicios/authentication.service';
import { first } from 'rxjs/operators';
import { consulta, alojamiento, Dias, temp } from '../interfaces/consulta-doc';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UtilitiesService } from '../servicios/utilities.service';
import { PoliciesService } from "../servicios/policies.service";

declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  formLogin: FormGroup;
  formForm: FormGroup;
  submitted: boolean = false;
  politicas1 = false;
  politicas = true;
  consulta = true;
  form = false;
  texto = 'Ya te encuentras inscrito para el sorteo de alojamiento';
  titulo = 'Mensaje principal';
  cronograma: alojamiento[];
  lugar: Dias[];
  day: temp[];
  datos;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    public policiesService: PoliciesService
  ) {
    this.createForm();
    this.createForm2();
  }

  ngOnInit() {
    this.formForm.controls['confirmEmail'].setValidators([
      Validators.required,
      this.equalsEmail.bind(this.formForm),
    ]);
    this.cargarAlojamiento();
  }

  createForm() {
    this.formLogin = this.formBuilder.group({
      document: [
        '',
        [
          Validators.required,
          Validators.min(99999),
          Validators.max(999999999999999),
          Validators.pattern('^[0-9]+'),
        ],
      ],
      typeDocument: ['', [Validators.required]],
    });
  }
  createForm2() {
    this.formForm = this.formBuilder.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern('[A-Za-zá-úÁ-Ú ]*')],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@' +
              '[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
          ),
          Validators.email,
        ],
      ],
      confirmEmail: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@' +
              '[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
          ),
          Validators.email,
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.min(99999),
          Validators.max(999999999999999),
          Validators.pattern('^[0-9]+'),
        ],
      ],
      typeSede: ['', [Validators.required]],
      typeAloja: ['', [Validators.required]],
      typeTemporada: ['', [Validators.required]],
    });
  }

  get f() {
    return this.formLogin.controls;
  }

  get getDocument() {
    return (
      this.formLogin.get('document').invalid &&
      this.formLogin.get('document').touched
    );
  }

  get r() {
    return this.formForm.controls;
  }
  equalsEmail(control: FormControl): { [s: string]: boolean } {
    let formForm: any = this;
    if (control.value !== formForm.controls['email'].value) {
      return {
        equalsemail: true,
      };
    }
    return null;
  }
  aceptoPoliticas() {
    this.utilitiesService.loading = true;
    this.consulta = true;
    this.politicas = false;
    setTimeout(() => {
      this.utilitiesService.loading = false;
    }, 1000);
  }
  aceptoPoliticas1() {
    if (this.politicas1) {
      this.politicas1 = false;
    } else {
      this.politicas1 = true;
    }
  }
  capturar(event: Event) {
    // Castear el target del evento a HTMLSelectElement
    const valorSeleccionado = (event.target as HTMLSelectElement).value;

    console.log('Valor seleccionado:', valorSeleccionado);
    for (let i = 0; i < this.cronograma.length; i++) {
      if (valorSeleccionado == this.cronograma[i].nombre) {
        this.lugar = this.cronograma[i].tipos;
      }
    }
  }
  onSubmit() {
    //this.utilitiesService.messageLoading = "";

    if (this.formLogin.invalid) {
      Object.values(this.f).forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    } else {
      if (!this.politicas1) {
        this.titulo = '¡Ten presente!';
        this.texto = 'Debes autorizar la política de tratamiento de datos';
        $('.btn-modal-warning').click();
      } else {
        this.utilitiesService.loading = true;
        let document = this.f.document.value;
        let tipo = this.f.typeDocument.value;
        console.log('tipo y cc ' + document + tipo);

        this.authenticationService
          .consultarDoc(document, tipo)
          .pipe(
            first(),
            catchError((error) => {
              if (error.status === 401) {
                // Manejar el error 401 aquí
                this.utilitiesService.loading = false;
                console.log('Error 401: No autorizado');
                this.titulo = '¡Ten presente!';
                this.texto = 'Error 401: No autorizado';
                $('.btn-modal-true').click();
                // Puedes redirigir a una página de inicio de sesión u otra acción
              }
              this.utilitiesService.loading = false;
              setTimeout(() => {
                this.titulo = '¡Ten presente!';
                this.texto = 'Verifica tu conexión a internet';
                $('.btn-modal-error').click();
              }, 500);
              // Propagar el error para que otras partes del código también lo manejen si es necesario
              return throwError(error);
            })
          )
          .subscribe((response: consulta) => {
            if (response.mensaje === '') {
              this.politicas = false;
              this.form = true;
              this.day = response.fechas;
              if (response.fechas.length != 0) {
                this.day = response.fechas;
              } else {
                this.titulo = '¡Ten presente! ';
                this.texto = 'No tenemos fechas disponibles';
                this.politicas = true;
                this.consulta = false;
                this.form = false;
                this.formLogin.reset();

                setTimeout(() => {
                  $('.btn-modal-warning').click();
                }, 500);
              }
            } else {
              this.titulo = '¡Ten presente! ';
              this.texto = response.mensaje;
              this.politicas = true;
              this.consulta = false;
              this.form = false;

              this.formLogin.reset();

              setTimeout(() => {
                $('.btn-modal-warning').click();
              }, 500);
            }
            this.utilitiesService.loading = false;
          });
      }
    }
  }

  onSubmit2() {
    //this.utilitiesService.messageLoading = "";

    if (this.formForm.invalid) {
      Object.values(this.r).forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    } else {
      this.utilitiesService.loading = true;
      let bodyInscripcion = this.getBodyInfo();
      console.log('CUerpo  ' + bodyInscripcion);

      this.authenticationService
        .guardarPreInscripcion(bodyInscripcion)
        .pipe(
          first(),
          catchError((error) => {
            if (error.status === 401) {
              // Manejar el error 401 aquí
              console.error('Error 401: No autorizado');
              // Puedes redirigir a una página de inicio de sesión u otra acción
            }
            this.utilitiesService.loading = false;
            setTimeout(() => {
              this.titulo = '¡Ten presente!';
              this.texto = 'Verifica tu conexión a internet';
              $('.btn-modal-error').click();
            }, 500);
            // Propagar el error para que otras partes del código también lo manejen si es necesario
            return throwError(error);
          })
        )
        .subscribe((response: consulta) => {
          this.formLogin.reset();
          this.formForm.reset();
          this.titulo = 'Registro exitoso';
          this.texto = 'Inscripción guardada correctamente.';
          this.politicas = true;
          this.consulta = false;
          this.form = false;
          this.politicas1 = false;
          this.utilitiesService.loading = false;
          setTimeout(() => {
            $('.btn-modal-true').click();
          }, 500);
        });
    }
  }

  private getBodyInfo() {
    let body = {
      IdSorteo: 1,
      documento: this.f.document.value.toString(),
      tipo: this.f.typeDocument.value,
      NombreCompleto: this.r.firstName.value.toLowerCase(),
      CorreoElectronico: this.r.email.value.toLowerCase(),
      Telefono: this.r.phone.value.toString(),
      SedeAlojamiento: this.r.typeSede.value,
      TipoAlojamiento: this.r.typeAloja.value,
      TemporadaAlojamiento: this.r.typeTemporada.value,
      UsuarioRegistro: 'portal',
    };
    return body;
  }

  private cargarAlojamiento() {
    const jsonString = `{
      "alojamientos": [
        {
          "nombre": "La Rochela",
          "tipos": [
            {"nombreCompleto": "Cabaña (6 px)"},
            {"nombreCompleto": "Cabaña (8 px)"},
            {"nombreCompleto": "Cabaña (11 px)"},
            {"nombreCompleto": "Apartamento (5 px)"},
            {"nombreCompleto": "Apartamento Chambacú (4 px)"},
            {"nombreCompleto": "Camping (5 px)"}
          ]
        },
        {
          "nombre": "Santágueda",
          "tipos": [
            {"nombreCompleto": "Cabaña (6 px)"},
            {"nombreCompleto": "Cabaña (10 px)"},
            {"nombreCompleto": "Cabaña (11 px)"}
          ]
        }
      ]
    }`;
    const jsonObject = JSON.parse(jsonString);
    this.cronograma = jsonObject.alojamientos;
  }
}
