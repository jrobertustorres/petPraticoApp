import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
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
              public navParams: NavParams) {
    this.indicacaoUsuarioEntity = new IndicacaoUsuarioEntity();
    this.qtdIndicacao = navParams.get('qtdIndicacao');
    this.qtdPontuacaoIndicacao = navParams.get('qtdPontuacaoIndicacao');

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  ngOnInit() {
  }

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
      "http://www.petpratico.com.br/img/logo_shared.jpg", this.linkLoja)
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