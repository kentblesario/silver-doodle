import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public loginForm: FormGroup;
  public isLoggedIn = false;
  public options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private camera: Camera
  ) {
    this.buildRegistrationForm();
    this.checkJwt();
  }

  async buildRegistrationForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  async openCamera(){
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(base64Image);
     }, (err) => {
      // Handle error
     });
  }

  checkJwt() {
    console.log(localStorage.getItem('jwt'));
    if (localStorage.getItem('jwt')) {
      this.isLoggedIn = true;
    }
  };

  logout(){
    localStorage.removeItem('jwt');
    this.isLoggedIn = false;
  }

  async onSubmit() {
    console.log(this.loginForm.value);
    this.authService.authenticate(this.loginForm.value).subscribe(async (res: any) => {
      if (res.status === 200) {
        console.log(res);
        localStorage.setItem('jwt', res.jwt);
        this.checkJwt();
      }
    });
    //http to backend
  }
}
