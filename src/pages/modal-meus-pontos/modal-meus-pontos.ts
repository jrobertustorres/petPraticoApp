import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-meus-pontos',
  templateUrl: 'modal-meus-pontos.html',
})
export class ModalMeusPontosPage {
  public loading = null;
  private qtdPontos: number;
  private dataAtualizacaoPontosFormat: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public viewCtrl: ViewController) {
    this.qtdPontos = navParams.get('qtdPontos');
    this.dataAtualizacaoPontosFormat = navParams.get('dataAtualizacaoPontosFormat');
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
