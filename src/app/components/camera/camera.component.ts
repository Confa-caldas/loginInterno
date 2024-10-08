import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
  Input,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
})
export class CameraComponent implements OnInit {
  public width: number;
  public height: number;
  returnUrl: string;
  formConsulta: FormGroup;
  @Input() mostrarBoton: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private cookieService: CookieService
  ) {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window;
    if (win.innerWidth < 768) {
      this.width = win.innerWidth - 20;
      this.height = win.innerHeight - 20;
    } else if (win.innerWidth >= 768 && win.innerWidth <= 800) {
      this.width = win.innerWidth / 2;
      this.height = win.innerHeight / 2;
    } else {
      this.width = win.innerWidth / 2;
      this.height = win.innerHeight / 2;
    }
  }

  // @Output()
  // public pictureTaken = new EventEmitter<WebcamImage>();
  @Output() public pictureTaken = new EventEmitter<{
    webcamImage: WebcamImage;
    tipoConsulta: number;
  }>();

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public tipoConsulta: number;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  public ngOnInit(): void {
    this.returnUrl = `/inicio`;
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    this.createForm();
  }

  get f() {
    return this.formConsulta.controls;
  }

  createForm() {
    this.formConsulta = this.formBuilder.group({
      document: [
        '',
        [
          Validators.required,
          Validators.min(99999),
          Validators.max(999999999999999),
          Validators.pattern('^[0-9]+'),
        ],
      ],
    });
  }

  public triggerSnapshot(tipoConsulta: number): void {
    this.tipoConsulta = tipoConsulta;
    this.trigger.next();
  }
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public handleImage(webcamImage: WebcamImage): void {
    //console.info("received webcam image", webcamImage);
    this.pictureTaken.emit({
      webcamImage: webcamImage,
      tipoConsulta: this.tipoConsulta,
    });
  }

  public cameraWasSwitched(deviceId: string): void {
    // console.log("active device: " + deviceId);
    this.deviceId = deviceId;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
