import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  private getQuery(query: string, bodyContent: any) {
    const url = `${environment.alojamiento}${query}`;
    const body = bodyContent;

    return this.http.post(url, body);
  }
  private get(query: string) {
    const url = `${query}`;

    return this.http.get(url);
  }

  consultarDoc(document: number, tipe: string) {
    let bodyValidate = {
      documento: document.toString(),
      tipo: tipe.toString(),
    };

    return (
      this.getQuery('metodo23', bodyValidate)
        /*  return this.http.get('assets/data/user.json') */
        .pipe(
          map((response: any) => {
            return response;
          })
        )
    );
  }
  guardarPreInscripcion(bodyValidate) {
    return (
      this.getQuery('metodo24', bodyValidate)
        /*  return this.http.get('assets/data/user.json') */
        .pipe(
          map((response: any) => {
            return response;
          })
        )
    );
  }

  inicioSesionInterno(body: any) {
    const url = environment.identificacionFacial + 'metodo33';
    let response = this.http.post(url, body);
    return response;
  }

  cancelarInicioSesionInterno(body: any) {
    const url = environment.identificacionFacial + 'metodo34';
    let response = this.http.post(url, body);
    return response;
  }

  consultarIp() {
    const url = environment.consultarIp;
    let response = this.http.post(url, '');
    return response;
  }

  inicioSesionInternoV2(imagen: string) {
    let body = {
      imgdata: imagen,
      excepcion: environment.excepcionFacial,
      tipoValidacion: environment.tipoValidacionFacial,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'qfdmzeFdxN2VetG1dYgRB4jLrxHrLTveaxss0aMH',
    });
    const url = environment.consultaLambdaDirecta;
    return this.http.post(url, body, { headers });
  }
}
