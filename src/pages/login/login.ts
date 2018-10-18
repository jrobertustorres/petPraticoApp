import { Component, OnInit } from '@angular/core';
// import { Constants } from '../../app/constants';
import { NavController, AlertController, LoadingController, MenuController, ModalController } from 'ionic-angular';
import { RecuperarSenhaPage } from '../recuperar-senha/recuperar-senha';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

//PAGE
import { HomePage } from '../home/home';
import { MeusDadosPage } from '../meus-dados/meus-dados';
import { ModalTermosPage } from './../modal-termos/modal-termos';
import { ModalPoliticaPrivacidadePage } from '../modal-politica-privacidade/modal-politica-privacidade';

//ENTITY
import { UsuarioEntity } from '../../model/usuario-entity';

//PROVIDER
import { LoginService } from '../../providers/login-service';

// @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  private loadingText: string;
  tabBarElement: any;

  constructor(public navCtrl: NavController, 
              private loginService: LoginService, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private menu : MenuController,
              public modalCtrl: ModalController,
              private formBuilder: FormBuilder) {

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.usuarioEntity = new UsuarioEntity();
  }

  ngOnInit() {
    this.loginForm 	= this.formBuilder.group({
      // 'login': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      'email': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'senha': ['', Validators.required]
   });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    // this.menu.enable(false);
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  goRecuperarSenha() {
    this.navCtrl.push(RecuperarSenhaPage);
  }

  criarConta() {
    this.navCtrl.push(MeusDadosPage);
  }

  submeterLogin() {
    try {
      if (this.loginForm.valid) {

        this.loadingText = 'Aguarde...';
        this.loading = this.loadingCtrl.create({
          content: this.loadingText
        });
        this.loading.present();

      this.loginService.login(this.loginForm.value)
        .then((usuarioEntityResult: UsuarioEntity) => {

          this.navCtrl.setRoot(HomePage);
          this.loading.dismiss();
        }, (err) => {
          this.loading.dismiss();
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: ['OK']
          }).present();
        });
      } else {
        Object.keys(this.loginForm.controls).forEach(campo => {
          const controle = this.loginForm.get(campo);
          controle.markAsTouched();
        })
      }
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  openModalTermos(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

  openModalPolitica(){
    let modal = this.modalCtrl.create(ModalPoliticaPrivacidadePage);
    modal.present();
  }

}
