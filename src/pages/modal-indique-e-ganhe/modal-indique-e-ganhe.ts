import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController, Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

//ENTITIES
import { IndicacaoUsuarioEntity } from '../../model/indicacao-usuario-entity';

//SERVICES
import { IndicacaoService } from '../../providers/indicacao-service';

@IonicPage()
@Component({
  selector: 'page-modal-indique-e-ganhe',
  templateUrl: 'modal-indique-e-ganhe.html',
})
export class ModalIndiqueEGanhePage {
  private loading = null;
  private linkLoja: string;
  private qtdIndicacao: number;
  private indicacaoUsuarioEntity: IndicacaoUsuarioEntity;
  private qtdPontuacaoIndicacao: number;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              private indicacaoService: IndicacaoService,
              private socialSharing: SocialSharing,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public platform: Platform,
              public navParams: NavParams) {
    this.indicacaoUsuarioEntity = new IndicacaoUsuarioEntity();
    this.qtdIndicacao = navParams.get('qtdIndicacao');
    this.qtdPontuacaoIndicacao = navParams.get('qtdPontuacaoIndicacao');
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  ngOnInit() {
    // this.getPlatform();
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.loading) {
      this.loading.dismiss();
      this.navCtrl.pop();
    }
  }

  // getPlatform() {
  //   if (this.platform.is('ios')) {
  //     this.linkLoja = "https://play.google.com/store/apps/details?id=br.com.logiictecnologia.petpratico";
  //   }
    
  //   if (this.platform.is('android')) {
  //     this.linkLoja = "https://play.google.com/store/apps/details?id=br.com.logiictecnologia.petpratico";
  //   }
  // }

  shareAnyWhere() {
    this.loading = this.loadingCtrl.create({
      content: 'Aguarde...'
    });
    this.loading.present();

    this.indicacaoService
    .indicaAplicativo()
    .then((indicacaoUsuarioEntityResult: IndicacaoUsuarioEntity) => {
      this.indicacaoUsuarioEntity = indicacaoUsuarioEntityResult;

      this.loading.dismiss();

      
      this.socialSharing.share("Estou gostando muito do Pet Prático! Tenha todos os Pet Shops na palma de sua mão! Use o código de indicação e ganhe pontos: " + this.indicacaoUsuarioEntity.codigoIndicacao,
      null, "http://www.petpratico.com.br/img/logo_shared.jpg", "www.petpratico.com.br")
      .then(() => {
      }).catch(() => {
      });
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
  }

}
