// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //alojamiento: 'http://localhost:8080/alojamientoWS/rest/alojamiento/',
  alojamiento: 'https://app.confa.co:8687/alojamientoWS/rest/alojamiento/',
  identificacionFacial:
    'https://identidad.confa.co/transaccionAutenticacionWS/transaccion/',
  consultarIp: 'https://appint.confa.co/consultaIP/circular007/obtenerIP/',
  consultaLambdaDirecta: 'https://api-facial.confa.co/identificarvalidar',
  excepcionFacial: 'ojos-boca-dimension-gafasDeSol-brillo',
  tipoValidacionFacial: 'validacion',
  key: 'dRZpGS5fqv36AYQ*',

  // identificacionFacial:
  //   'http://localhost:8081/transaccionAutenticacionWS/transaccion/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
