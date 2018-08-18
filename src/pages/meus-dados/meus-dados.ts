import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

//UTILITARIOS
import { PasswordValidation } from '../../utilitarios/password-validation';

//ENTITYS
import { UsuarioEntity } from './../../model/usuario-entity';
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';

//PAGES
import { HomePage } from '../home/home';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';

// SERVICES
import { UsuarioService } from '../../providers/usuario-service';

// @IonicPage()
@Component({
  selector: 'page-meus-dados',
  templateUrl: 'meus-dados.html',
})
export class MeusDadosPage implements OnInit {

  public dadosUsuarioForm: FormGroup;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  private loadingDados = null;
  private isReadOnly = null;
  private idUsuarioLogado = null;
  tabBarElement: any;
  // public userChangeEvent = new EventEmitter();
  // public emailPessoaChangeEvent = new EventEmitter();

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private usuarioService: UsuarioService,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              public modalCtrl: ModalController) {

    this.usuarioDetalheEntity = new UsuarioDetalheEntity();
    this.usuarioEntity = new UsuarioEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ngOnInit() {

    this.dadosUsuarioForm = this.formBuilder.group({
      'nomePessoa': ['', [Validators.required, Validators.maxLength(100)]],
      'cpfPessoa': ['', [Validators.required, Validators.maxLength(14)]],
      'emailUsuario': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'telefonePessoa': ['', Validators.maxLength(50)],
      'senhaUsuario': [''],
      'confirmSenha': ['']
      // 'statusAceitoTermoUso': ['false']
    }, {
        validator: PasswordValidation.MatchPassword // your validation method
      }
    );

    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    if(!localStorage.getItem(Constants.ID_USUARIO)){
      this.isReadOnly = false;
      this.dadosUsuarioForm.get('senhaUsuario').setValidators([Validators.required]);
    } else if(localStorage.getItem(Constants.ID_USUARIO)) {
      this.isReadOnly = true;
      this.callGetDadosUsuario();
    }
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    // if(!localStorage.getItem(Constants.ID_USUARIO)) {
    this.tabBarElement.style.display = 'none';
    // }
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Cadastro atualizado!',
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  submeterDadosUsuario() {
    try {

      if (this.dadosUsuarioForm.valid) {
        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...',
          // dismissOnPageChange: true
        });
        this.loading.present();

        // this._storage.get(Constants.ID_USUARIO).then((idUsuario) => {
          if(!localStorage.getItem(Constants.ID_USUARIO)){
            this.cadastraUsuario();
          }
          else if(localStorage.getItem(Constants.ID_USUARIO)) {
            this.editaUsuario();
          }
        // });

      } else {
        Object.keys(this.dadosUsuarioForm.controls).forEach(campo => {
          const controle = this.dadosUsuarioForm.get(campo);
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

  cadastraUsuario() {
    this.usuarioService
    .cadastraUsuario(this.dadosUsuarioForm.value)
    .then((usuarioEntityResult: UsuarioEntity) => {

      this.loading.dismiss();
      this.navCtrl.setRoot(HomePage);
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
  }

  editaUsuario() {
    this.usuarioService
    .atualizaUsuario(this.usuarioDetalheEntity)
    .then((usuarioDetalheEntityResult: UsuarioDetalheEntity) => {
      this.loading.dismiss();
      this.presentToast();
      setTimeout(() => {
        this.navCtrl.setRoot(ConfiguracoesPage);
      }, 3000);
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });

  }

  callGetDadosUsuario() {
    try {
      this.loadingDados = this.loadingCtrl.create({
        content: 'Aguarde...',
        // dismissOnPageChange: true
      });
      this.loadingDados.present();

      this.usuarioService
        .getDadosUsuario()
        .then((dadosUsuarioDetalheResult) => {
          this.usuarioDetalheEntity = dadosUsuarioDetalheResult;

          this.loadingDados.dismiss();
          // this.getCidadesByEstadoUsuario(dadosUsuarioDetalheResult.idEstado);
        })
        .catch(err => {
          this.loadingDados.dismiss();
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: ['OK']
          }).present();
        });
    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

}
