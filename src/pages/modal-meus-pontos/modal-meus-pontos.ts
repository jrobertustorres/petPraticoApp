import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

//SERVICES
import { UsuarioService } from '../../providers/usuario-service';

//ENTITIES
import { UsuarioEntity } from '../../model/usuario-entity';

@IonicPage()
@Component({
  selector: 'page-modal-meus-pontos',
  templateUrl: 'modal-meus-pontos.html',
})
export class ModalMeusPontosPage {
  public loading = null;
  // private usuarioEntity: UsuarioEntity;
  private qtdPontos: number;
  private dataAtualizacaoPontosFormat: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private usuarioService: UsuarioService,
              public viewCtrl: ViewController) {
    // this.usuarioEntity = new UsuarioEntity();
    this.qtdPontos = navParams.get('qtdPontos');
    this.dataAtualizacaoPontosFormat = navParams.get('dataAtualizacaoPontosFormat');
  }

  ngOnInit() {
    // this.findByPontuacao();
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  // findByPontuacao() {
  //   try {
  //     this.loading = this.loadingCtrl.create({
  //       content: 'Aguarde...'
  //     });
  //     this.loading.present();

  //     this.usuarioService.findByPontuacao()
  //     .then((usuarioEntityResult: UsuarioEntity) => {
  //       this.usuarioEntity = usuarioEntityResult;

  //       this.loading.dismiss();
  //     }, (err) => {
  //       this.loading.dismiss();
  //       this.alertCtrl.create({
  //         subTitle: err.message,
  //         buttons: ['OK']
  //       }).present();
  //     });

  //   }catch (err){
  //     if(err instanceof RangeError){
  //     }
  //     console.log(err);
  //   }

  // }

}
