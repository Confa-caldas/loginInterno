import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../servicios/utilities.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {
  constructor(public utilitiesService: UtilitiesService) {}

  ngOnInit(): void {}
}
