import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//ENTITYS
import { ItemPedidoEntity } from '../../model/item-pedido-entity';
import { MeusPedidoEntity } from '../../model/meus-pedido-entity';

//SERVICES
import { CarrinhoService } from '../../providers/carrinho-service';

//PAGES
import { LoginPage } from '../login/login';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
import { PagamentoPage } from '../pagamento/pagamento';

@IonicPage()
@Component({
  selector: 'page-carrinho',
  templateUrl: 'carrinho.html',
})
export class CarrinhoPage {
  public loading = null;
  public dadosPedido: any;
  public itensCarrinho: {};
  private itemPedidoEntity: ItemPedidoEntity;
  private meusPedidoEntity: MeusPedidoEntity;
  public idUsuarioLogado: string;
  private toastMessage: string;
  private itensCarrinhoAtual: any;
  private valorDescontoFormat: any;
  private isRequerDesconto: boolean;
  public showLoading: boolean = true;
  public mostraBotao: boolean = true;
  tabBarElement: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private carrinhoService: CarrinhoService,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              public alertCtrl: AlertController) {
    this.itemPedidoEntity = new ItemPedidoEntity();
    this.meusPedidoEntity = new MeusPedidoEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    // this.itemPedidoEntity = new ItemPedidoEntity();
    // this.meusPedidoEntity = new MeusPedidoEntity();
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    if (localStorage.getItem(Constants.ID_USUARIO)) {
      this.getDadosCarrinho();
    }
  }

  // ionViewWillLeave() {
  //   this.itemPedidoEntity = new ItemPedidoEntity();
  //   this.meusPedidoEntity = new MeusPedidoEntity();
  // }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.toastMessage,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  getDadosCarrinho(){
    try {
      if(this.showLoading == true) {
        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...'
        });
        this.loading.present();
      }

      this.carrinhoService.listarItemPedidoCarrinho()
      .then((itemResult: MeusPedidoEntity) => {
        this.meusPedidoEntity = itemResult;

        this.itensCarrinho = this.meusPedidoEntity.listMeusItemPedidoEntities;
        this.isRequerDesconto = this.meusPedidoEntity.isRequerDesconto;
        this.mostraBotao = this.itensCarrinho ? true : false;
       
        if (this.meusPedidoEntity.isRequerDesconto || this.meusPedidoEntity.valorDescontoFormat != null) {
          this.valorDescontoFormat = this.meusPedidoEntity.valorDescontoFormat;
        } else {
            this.valorDescontoFormat = "0,00";
        }
        // this.nomeProduto = this.dadosProduto[0].nomeProduto;
        // this.unidadeProduto = this.dadosProduto[0].unidadeProduto;
        // this.imagemProduto = this.dadosProduto[0].imagem;
        // this.menorValor = this.dadosProduto[0].menorValor;

        this.showLoading = true;
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

  toggleChangeRequerDesconto() {
    this.isRequerDesconto = !this.isRequerDesconto;
    this.calculoValorItemCarrinho(this.itensCarrinho);
  }

  subtrairProduto(item) {
    item.quantidadeItem -= 1;
    this.showLoading = false;
    if (item.quantidadeItem < 1) {
      item.quantidadeItem = 1;
    } else {
        this.calculoValorItemCarrinho(item);
    }
  }

  addProduto(item) {
    item.quantidadeItem += 1;
    this.showLoading = false;
    this.calculoValorItemCarrinho(item);
  }

  calculoValorItemCarrinho(item) {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.itemPedidoEntity.idItemPedido = item.idItemPedido;
      this.itemPedidoEntity.qtdItemCarrinho = item.quantidadeItem;
      this.itemPedidoEntity.isRequerDesconto = this.meusPedidoEntity.isRequerDesconto;

      this.carrinhoService.alteraItemPedidoCarrinho(this.itemPedidoEntity)
      .then((itemPedidoResult: MeusPedidoEntity) => {
        this.getDadosCarrinho();

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

  confirmaRemoverCarrinho(itemCarrinho) {
    const confirm = this.alertCtrl.create({
      title: 'Remover item do carrinho',
      message: 'Deseja remover este item do carrinho?',
      buttons: [
        {
          text: 'MANTER',
          handler: () => {
          }
        },
        {
          text: 'REMOVER',
          handler: () => {
            this.removerCarrinho(itemCarrinho);
          },
          cssClass: 'alertDanger'
        }
      ]
    });
    confirm.present();
  }

  removerCarrinho(idItemPedido) {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.itemPedidoEntity.idItemPedido = idItemPedido;

      this.carrinhoService.removerItemPedidoCarrinho(this.itemPedidoEntity)
      .then((itemPedidoResult: MeusPedidoEntity) => {

        if(itemPedidoResult.idPedido != null) {
          localStorage.setItem(Constants.QTD_ITENS_CARRINHO, JSON.stringify(itemPedidoResult.qtdItemcarrinhoCliente));
          localStorage.setItem(Constants.ID_FORNECEDOR_ATUAL_CARRINHO, JSON.stringify(itemPedidoResult.idFornecedor));
        } else {
          this.itensCarrinhoAtual = itemPedidoResult;
          localStorage.removeItem(Constants.QTD_ITENS_CARRINHO);
          localStorage.removeItem(Constants.ID_FORNECEDOR_ATUAL_CARRINHO);
        }

        this.showLoading = false;
        this.getDadosCarrinho();

        // this.loading.dismiss();
        this.toastMessage = 'O produto foi removido do carrinho!';
        this.presentToast();
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

  continuarCarrinho() {
    if (this.meusPedidoEntity.isCadastroCompleto) {
      if (!this.meusPedidoEntity.isAtendimento) {
          this.showAlertIsAtendimento();
      } else {
          this.navCtrl.push(PagamentoPage, {idPedido: this.meusPedidoEntity.idPedido, idFornecedor: this.meusPedidoEntity.idFornecedor});
      }
    } else {
        this.showAlertCadastro();
    }
  }

  showAlertCadastro() {
    const alert = this.alertCtrl.create({
      title: 'Seu cadastro está incompleto!',
      subTitle: 'Para continuar complete seus dados pessoais.',
      // subTitle: 'Para continuar complete seus dados pessoais e endereço.',
      buttons: [{
        text: 'COMPLETAR CADASTRO',
        handler: () => {
          this.navCtrl.push(ConfiguracoesPage);
        }
      }]
    });
    alert.present();
  }
  
  showAlertIsAtendimento() {
    const alert = this.alertCtrl.create({
      title: 'A loja encontra-se fechada no momento!',
      subTitle: 'Não é possível finalizar a compra. Verifique o horário de funcionamento desta loja.',
      buttons: ['OK']
    });
    alert.present();
  }

  openLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  goHomePage() {
    this.navCtrl.parent.select(0);
  }

}
