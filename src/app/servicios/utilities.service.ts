import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
   // Loading
   loading: boolean = false;
   messageLoading: string = null;

  constructor() { }
}
