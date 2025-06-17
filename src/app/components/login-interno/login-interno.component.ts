import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../servicios/authentication.service';
import { UtilitiesService } from '../../servicios/utilities.service';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';

declare var $;
@Component({
  selector: 'app-login-interno',
  templateUrl: './login-interno.component.html',
  styleUrls: ['./login-interno.component.css'],
})
export class LoginInternoComponent implements OnInit {
  private idTransaccion: number = 0;
  nombreSistema = '';
  texto = '';
  titulo = '';
  private newTab: Window | null = null;
  myIP: string;
  showError: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const encryptedTransaccion = decodeURIComponent(params['prM1']);
      const encryptedSistema = decodeURIComponent(params['prM2']);
      const secretKey = environment.key;
      console.log(encryptedTransaccion);
      console.log(encryptedSistema);

      if (encryptedTransaccion && encryptedSistema) {
        try {
          const decryptedTransaccion = this.xorEncryptDecrypt(
            encryptedTransaccion,
            secretKey
          );
          const decryptedSistema = this.xorEncryptDecrypt(
            encryptedSistema,
            secretKey
          );

          // Validar si el resultado de desencriptación es correcto
          if (!isNaN(Number(decryptedTransaccion)) && decryptedSistema) {
            this.idTransaccion = parseInt(decryptedTransaccion, 10);
            this.nombreSistema = decryptedSistema;
            this.showError = false;
          } else {
            this.showError = true;
          }
        } catch (error) {
          this.showError = true;
        }
      } else {
        this.showError = true;
      }
    });

    this.consultarip();
  }

  consultarip() {
    this.authenticationService.consultarIp().subscribe((response: any) => {
      this.myIP = response.ip;
    });
  }

  public webcamImage: WebcamImage = null;
  handleImage(event: { webcamImage: WebcamImage; tipoConsulta: number }): void {
    this.webcamImage = event.webcamImage;
    if (event.tipoConsulta == 1) {
      this.validateFace();
    } else {
      this.cancelarInicioSesion();
    }
  }

  validateFace() {
    if (this.idTransaccion != null && this.idTransaccion != 0) {
      this.utilitiesService.loading = true;
      this.authenticationService
        .inicioSesionInternoV2(this.webcamImage.imageAsBase64)
        .subscribe(
          (response: any) => {
            let autenticado = true;
            let documento = '';
            let mensajeMostrar = '';
            if (['No se identifico.', 'error', ''].includes(response.doc)) {
              autenticado = false;
              documento = response.doc;
              if (response.doc !== '') {
                mensajeMostrar = response.doc;
              } else {
                mensajeMostrar = response.msg;
              }
            } else {
              const documentoSplit = response.doc.toString().split('-');
              documento = documentoSplit[0];
              if (!response.est) {
                autenticado = false;
              }
              mensajeMostrar = response.msg;
            }

            let body = {
              documento: documento,
              idTransaccion: this.idTransaccion.toString(),
              direccionip: this.myIP,
              imagenPersona: this.webcamImage.imageAsBase64,
              autenticado: autenticado,
              mensajeRespuesta: mensajeMostrar,
            };

            this.authenticationService.inicioSesionInterno(body).subscribe(
              (response: any) => {
                const estado = response.estado;
                const mensaje = response.mensaje;
                if (estado) {
                  this.utilitiesService.loading = false;
                  if (!autenticado) {
                    setTimeout(() => {
                      this.titulo = '¡Ten presente!';
                      this.texto = mensajeMostrar;
                      $('.btn-modal-error').click();
                    }, 500);
                  }
                } else {
                  this.utilitiesService.loading = false;
                  setTimeout(() => {
                    this.titulo = '¡Ten presente!';
                    this.texto = mensaje;
                    $('.btn-modal-error').click();
                  }, 500);
                }
              },
              (error: any) => {
                this.utilitiesService.loading = false;
                setTimeout(() => {
                  this.titulo = '¡Ten presente!';
                  this.texto = error;
                  $('.btn-modal-error').click();
                }, 500);
              }
            );
          },
          (error: any) => {
            this.utilitiesService.loading = false;
            setTimeout(() => {
              this.titulo = '¡Ten presente!';
              this.texto = error;
              $('.btn-modal-error').click();
            }, 500);
          }
        );
    } else {
      this.utilitiesService.loading = false;
      setTimeout(() => {
        this.titulo = '¡Ten presente!';
        this.texto = 'No estas iniciando sesion en ningun aplicativo';
        $('.btn-modal-error').click();
      }, 500);
    }
  }

  cancelarInicioSesion() {
    if (this.idTransaccion != null && this.idTransaccion != 0) {
      this.utilitiesService.loading = true;
      let body = {
        idTransaccion: this.idTransaccion.toString(),
      };
      this.authenticationService
        .cancelarInicioSesionInterno(body)
        .subscribe((response: any) => {
          this.utilitiesService.loading = false;
          const estado = response.estado;
          const mensaje = response.mensaje;
          if (estado) {
            if (window.opener) {
              window.close();
            } else {
              window.close();
            }
          } else {
            setTimeout(() => {
              this.titulo = '¡Ten presente!';
              this.texto = mensaje;
              $('.btn-modal-error').click();
            }, 500);
          }
        });
    } else {
      this.utilitiesService.loading = false;
      setTimeout(() => {
        this.titulo = '¡Ten presente!';
        this.texto = 'No estas cancelando sesion en ningun aplicativo';
        $('.btn-modal-error').click();
      }, 500);
    }
  }

  openTab(): void {
    this.newTab = window.open('https://www.google.com', '_blank');
  }
  closeTab(): void {
    alert('prueba');
    window.open('', '_self')?.close();
  }

  goBack(): void {}

  xorEncryptDecrypt(input: string, key: string): string {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      result += String.fromCharCode(
        input.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  }
}
