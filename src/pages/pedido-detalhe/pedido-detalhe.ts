import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';

//SERVICES
import { PedidoService } from './../../providers/pedido-service';

//ENTITYS
import { PedidoEntity } from './../../model/pedido-entity';
import { MeusPedidoEntity } from '../../model/meus-pedido-entity';

@IonicPage()
@Component({
  selector: 'page-pedido-detalhe',
  templateUrl: 'pedido-detalhe.html',
})
export class PedidoDetalhePage {
  public loading = null
  private idPedido: number;
  private pedidoEntity: PedidoEntity;
  private meusPedidoEntity: MeusPedidoEntity;
  public dadosPedido: any;
  public itensPedido: any;
  tabBarElement: any;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private pedidoService: PedidoService, 
              public platform: Platform,
              public navParams: NavParams) {
    this.pedidoEntity = new PedidoEntity();
    this.meusPedidoEntity = new MeusPedidoEntity();
    this.idPedido = navParams.get('idPedido');
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
  }

  ngOnInit() {
    this.findPedidoDetalhe();
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

  findPedidoDetalhe() {
    try {
      
    this.loading = this.loadingCtrl.create({
      content: 'Aguarde...'
    });
    this.loading.present();

    this.pedidoEntity.idPedido = this.idPedido;
    this.pedidoService.findUltimosItemPedidos(this.pedidoEntity)
      .then((pedidoEntityResult: MeusPedidoEntity) => {
        this.meusPedidoEntity = pedidoEntityResult;
        this.itensPedido = this.meusPedidoEntity.listMeusItemPedidoEntities;

        this.loading.dismiss();
      }, (err) => { 
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });
  }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

}
