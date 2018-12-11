import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';

//SERVICES
import { PedidoService } from './../../providers/pedido-service';

//ENTITYS
import { PedidoEntity } from './../../model/pedido-entity';

//PAGES
import { PedidoDetalhePage } from './../pedido-detalhe/pedido-detalhe';
import { HomePage } from './../home/home';

@IonicPage()
@Component({
  selector: 'page-meus-pedidos-list',
  templateUrl: 'meus-pedidos-list.html',
})
export class MeusPedidosListPage {
  private loading = null;
  private pedidoEntity: PedidoEntity;
  private pedidosList: any;
  tabBarElement: any;

  constructor(public navCtrl: NavController,
              private pedidoService: PedidoService, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public platform: Platform,
              public navParams: NavParams) {
    this.pedidoEntity = new PedidoEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
  }

  ngOnInit() {
    this.findPedidosList();
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

  findPedidosList() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.pedidoService.findUltimosPedidos()
      .then((pedidosListResult: PedidoEntity) => {
        this.pedidosList = pedidosListResult;

        this.loading.dismiss();
      }, (err) => {
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

  openPedidoDetalhePage(idPedido) {
    this.navCtrl.push(PedidoDetalhePage, {
      idPedido: idPedido
    })
  }

  goHome() {
    let currentIndex = this.navCtrl.getActive().index;
      this.navCtrl.parent.select(0).then(() => {
        this.navCtrl.remove(currentIndex);
    });
  }

}
