import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//ENTITYS
import { ItemPedidoEntity } from '../../model/item-pedido-entity';
import { MeusPedidoEntity } from '../../model/meus-pedido-entity';

//SERVICES
import { CarrinhoService } from '../../providers/carrinho-service';

//PAGES
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-carrinho',
  templateUrl: 'carrinho.html',
})
export class CarrinhoPage {
  public loading = null;
  public dadosPedido: any;
  public itensCarrinho: {};
  // private itemPedidoEntity: any;
  private itemPedidoEntity: ItemPedidoEntity;
  private meusPedidoEntity: MeusPedidoEntity;
  public idUsuario: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private carrinhoService: CarrinhoService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    this.itemPedidoEntity = new ItemPedidoEntity;
    this.meusPedidoEntity = new MeusPedidoEntity();
  }

  ngOnInit() {

    if (this.idUsuario = localStorage.getItem(Constants.ID_USUARIO)) {
      this.getDadoscarrinho();
    }
  }

  ionViewDidLoad() {
  }

  getDadoscarrinho(){
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      // this.itemPedidoEntity['idUsuario'] = localStorage.getItem(Constants.ID_USUARIO);
      this.carrinhoService.getItensPedidoCarrinho(this.itemPedidoEntity)
      .then((itemResult: MeusPedidoEntity) => {
        this.meusPedidoEntity = itemResult;
        // this.itensCarrinho = this.itemPedidoEntity.listMeusItemPedidoEntities;
        console.log(this.meusPedidoEntity.listMeusItemPedidoEntities);
        // this.nomeProduto = this.dadosProduto[0].nomeProduto;
        // this.unidadeProduto = this.dadosProduto[0].unidadeProduto;
        // this.imagemProduto = this.dadosProduto[0].imagem;
        // this.menorValor = this.dadosProduto[0].menorValor;

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

  openLoginPage() {
    this.navCtrl.push(LoginPage);
  }

}
