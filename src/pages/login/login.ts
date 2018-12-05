import { Component, OnInit } from '@angular/core';
import { Constants } from '../../app/constants';
import { NavController, AlertController, LoadingController, MenuController, ModalController, App } from 'ionic-angular';
import { RecuperarSenhaPage } from '../recuperar-senha/recuperar-senha';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { Facebook } from '@ionic-native/facebook';

//PAGE
import { HomePage } from '../home/home';
import { MeusDadosPage } from '../meus-dados/meus-dados';
import { ModalTermosPage } from './../modal-termos/modal-termos';
import { ModalPoliticaPrivacidadePage } from '../modal-politica-privacidade/modal-politica-privacidade';
import { TabsPage } from '../tabs/tabs';

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
  private usuarioEntityResult: any;

  isLoggedIn: boolean = false;
  users: any;

  constructor(public navCtrl: NavController, 
              private loginService: LoginService, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private menu : MenuController,
              public modalCtrl: ModalController,
              public app: App,
              public facebook: Facebook,
              private formBuilder: FormBuilder) {

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.usuarioEntity = new UsuarioEntity();

    if(localStorage.getItem(Constants.ID_USUARIO)) {
      facebook.getLoginStatus()
      .then(res => {
        if(res.status === "connect") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log(e));
    }
  }

  ngOnInit() {
    this.loginForm 	= this.formBuilder.group({
      'email': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'senha': ['', Validators.required]
   });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
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

        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...'
        });
        this.loading.present();

      this.loginService.login(this.loginForm.value)
        .then((usuarioEntityResult: UsuarioEntity) => {

          // se não fizer assim, a tela de login fica aberta sobre a tela de configurações
          let currentIndex = this.navCtrl.getActive().index;
          this.navCtrl.parent.select(0).then(() => {
              this.navCtrl.remove(currentIndex);
          });

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

  doFbLogin(){
    this.facebook.login(['public_profile', 'email'])
    .then(res => {
      if(res.status === "connected") {
        this.isLoggedIn = true;
        this.getUserDetail(res.authResponse.userID);
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log('Error logging into Facebook', e));
  }

  getUserDetail(userid) {
    this.facebook.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
      .then(res => {
        this.users = res;
        this.usuarioEntity.idUsuarioFacebook = this.users.id;
        this.usuarioEntity.nomePessoa = this.users.name;
        this.usuarioEntity.emailUsuario = this.users.email;

      this.callLoginFacebookWS(this.usuarioEntity);
    })
    .catch(e => {
      console.log(e);
    });
  }

  callLoginFacebookWS(usuarioEntity) {
    
    this.loginService.loginFacebook(usuarioEntity)
    .then((usuarioEntityResult: UsuarioEntity) => {

      // se não fizer assim, a tela de login fica aberta sobre a tela de configurações
      let currentIndex = this.navCtrl.getActive().index;
      this.navCtrl.parent.select(0).then(() => {
          this.navCtrl.remove(currentIndex);
      });

    }, (err) => {
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
  }

}
