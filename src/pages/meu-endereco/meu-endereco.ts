import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ModalController, Platform } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../app/constants';

//ENTITYS
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';
import { EnderecoEntity } from '../../model/endereco-entity';

//SERVICES
import { UsuarioService } from '../../providers/usuario-service';
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';

//PAGES
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
import { ModalCidadesPage } from '../modal-cidades/modal-cidades';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-meu-endereco',
  templateUrl: 'meu-endereco.html',
})
export class MeuEnderecoPage {
  public enderecoUsuarioForm: FormGroup;
  private loading = null;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  private enderecoEntity: EnderecoEntity;
  private estados = [];
  private cidades: any = [];
  tabBarElement: any;

  public idCidade: string;
  public cidade: string;
  public dadosCidades = {'idCidade': this.idCidade, 'cidade': this.cidade};
  idEstado: number;

  constructor(public navCtrl: NavController, 
              private formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              private usuarioService: UsuarioService,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private estadosService: EstadosService, 
              private cidadesService: CidadesService, 
              public modalCtrl: ModalController,
              public platform: Platform,
              public navParams: NavParams) {
    this.usuarioDetalheEntity = new UsuarioDetalheEntity();
    this.enderecoEntity = new EnderecoEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());

  }

  ngOnInit() {

    // aqui temos que analizar se já temos o cadastro de endereço ===================================
    this.callGetEnderecoUsuario();

    this.enderecoUsuarioForm = this.formBuilder.group({
      'cepEndereco': ['', [Validators.required, Validators.maxLength(10)]],
      'endereco': ['', [Validators.required, Validators.maxLength(200)]],
      'numeroEndereco': ['', [Validators.required, Validators.maxLength(11)]],
      'complementoEndereco': ['', [Validators.required, Validators.maxLength(50)]],
      'bairro': ['', [Validators.required, Validators.maxLength(100)]],
      'idEstado': ['', Validators.required],
      'idCidade': [''],
    });

    this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.loading) {
      this.loading.dismiss();
      this.navCtrl.pop();
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Seu endereço foi alterado!',
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  callGetEnderecoUsuario() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...',
      });
      this.loading.present();

      this.usuarioService
        .getDadosUsuario()
        .then((dadosUsuarioDetalheResult) => {
          this.usuarioDetalheEntity = dadosUsuarioDetalheResult;
          this.enderecoEntity = this.usuarioDetalheEntity;

          if(this.usuarioDetalheEntity.idEstado) {
            this.getCidadesByEstadoUsuario(this.usuarioDetalheEntity.idEstado);
            this.idEstado = this.usuarioDetalheEntity.idEstado; // setando o idEstado para habilitar o combo de cidades
          } else {
            this.loading.dismiss();
          }
        })
        .catch(err => {
          this.loading.dismiss();
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

  getCidadesByEstadoUsuario(idEstado) {
    try {

      this.cidadesService
        .getCidades(idEstado)
        .then((listCidadesResult) => {
          this.cidades = listCidadesResult;

          for (let cidade of this.cidades) {
            if (cidade.idCidade == this.usuarioDetalheEntity.idCidade) {
              this.dadosCidades = cidade; 
            }
          }
          this.loading.dismiss();
        })
        .catch(err => {
          this.loading.dismiss();
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

  submeterEnderecoUsuario() {
    try {

      if (this.enderecoUsuarioForm.valid) {
        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...'
        });
        this.loading.present();

        // AQUI TEMOS QUE TER UMA FORMA DE VER SE O ENDEREÇO ESTÁ COMPLETO OU NÃO
        if(!localStorage.getItem(Constants.ID_USUARIO)){
          this.cadastraEndereco();
        }
        else if(localStorage.getItem(Constants.ID_USUARIO)) {
          this.editaEndereco();
        }

      } else {
        Object.keys(this.enderecoUsuarioForm.controls).forEach(campo => {
          const controle = this.enderecoUsuarioForm.get(campo);
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

  cadastraEndereco() {
    this.usuarioService
    .cadastroEndereco(this.enderecoUsuarioForm.value)
    .then((enderecoEntityResult: EnderecoEntity) => {

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

  editaEndereco() {
    this.enderecoUsuarioForm.value.idCidade = this.dadosCidades.idCidade;
    this.enderecoEntity = this.enderecoUsuarioForm.value;

    this.usuarioService
      .alteraEndereco(this.enderecoEntity)
      .then((enderecoEntityResult: EnderecoEntity) => {
  
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

  getIdEstado(idEstado: any) {
    this.idEstado = idEstado;
  }

  showModalCidades(){
    let modal = this.modalCtrl.create(ModalCidadesPage, {idEstado: this.idEstado});

    modal.onDidDismiss((data) => {
      if (data) {
        this.idCidade = data.idCidade;
        this.dadosCidades = data;
      }
    });

    modal.present();
  }
  

  

}
