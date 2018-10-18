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
import { HomePage } from '../home/home';
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
  // private itemPedidoEntity: any;
  private itemPedidoEntity: ItemPedidoEntity;
  private meusPedidoEntity: MeusPedidoEntity;
  public idUsuarioLogado: string;
  private toastMessage: string;
  private itensCarrinhoAtual: any;
  private valorDescontoFormat: any;
  private isRequerDesconto: boolean;
  // private quantidade: number = 0;
  public showLoading: boolean = true;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private carrinhoService: CarrinhoService,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              public alertCtrl: AlertController) {
    this.itemPedidoEntity = new ItemPedidoEntity;
    this.meusPedidoEntity = new MeusPedidoEntity();
  }

  ngOnInit() {
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    // this.carrinhoService.qtdItensCarrinhoChangeEvent.subscribe(qtdItensCarrinhoChangeEvent => {
    //   console.log(qtdItensCarrinhoChangeEvent);
    //   localStorage.setItem(Constants.QTD_ITENS_CARRINHO, qtdItensCarrinhoChangeEvent);
    // });

    // if (this.idUsuario = localStorage.getItem(Constants.ID_USUARIO)) {
    if (localStorage.getItem(Constants.ID_USUARIO)) {
      this.getDadoscarrinho();
    }
  }

  ionViewDidLoad() {
  }

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

  getDadoscarrinho(){
    try {
      if(this.showLoading == true) {
        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...'
        });
        this.loading.present();
      }

      // this.itemPedidoEntity.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
      // this.carrinhoService.getItensPedidoCarrinho(this.itemPedidoEntity)
      this.carrinhoService.listarItemPedidoCarrinho(this.itemPedidoEntity)
      .then((itemResult: MeusPedidoEntity) => {
        this.meusPedidoEntity = itemResult;
        this.itensCarrinho = this.meusPedidoEntity.listMeusItemPedidoEntities;
        this.isRequerDesconto = this.meusPedidoEntity.isRequerDesconto;
        console.log(this.meusPedidoEntity);
        console.log(this.itensCarrinho);
        console.log(this.meusPedidoEntity.listMeusItemPedidoEntities);

        if (this.meusPedidoEntity.isRequerDesconto || this.meusPedidoEntity.valorDescontoFormat != null) {
          this.valorDescontoFormat = this.meusPedidoEntity.valorDescontoFormat;
        } else {
            this.valorDescontoFormat = "0,00";
        }
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

  removerCarrinho(itemCarrinho) {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.carrinhoService.removerItemPedidoCarrinho(itemCarrinho)
      .then((itemPedidoResult: MeusPedidoEntity) => {
        localStorage.setItem(Constants.ID_FORNECEDOR_ATUAL_CARRINHO, JSON.stringify(itemPedidoResult.idFornecedor));
        if(itemPedidoResult) {
          localStorage.setItem(Constants.QTD_ITENS_CARRINHO, JSON.stringify(itemPedidoResult.qtdItemcarrinhoCliente));
        } else {
          this.itensCarrinhoAtual = itemPedidoResult;
          localStorage.setItem(Constants.QTD_ITENS_CARRINHO, JSON.stringify(0));
        }
        this.showLoading = false;
        this.getDadoscarrinho();

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

      // this.qtdItemCarrinho = this.quantidade;
      this.itemPedidoEntity.idItemPedido = item.idItemPedido;
      this.itemPedidoEntity.qtdItemCarrinho = item.quantidadeItem;
      this.itemPedidoEntity.isRequerDesconto = this.meusPedidoEntity.isRequerDesconto;

      this.carrinhoService.alteraItemPedidoCarrinho(this.itemPedidoEntity)
      .then((itemPedidoResult: MeusPedidoEntity) => {
        this.getDadoscarrinho();

        // this.loading.dismiss();
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

  continuarCarrinho() {
    if (this.meusPedidoEntity.isCadastroCompleto) {
      // if (!this.meusPedidoEntity.isAtendimento) {
      if (this.meusPedidoEntity.isAtendimento) {
          this.showAlertIsAtendimento();
      } else {
          // $location.path("/pagamento/" + idPedido + "/" + idFornecedor);
          this.navCtrl.push(PagamentoPage, {idPedido: this.meusPedidoEntity.idPedido, idFornecedor: this.meusPedidoEntity.idFornecedor});
      }
  } else {
      this.showAlertCadastro();
  }

  }

  showAlertCadastro() {
    const alert = this.alertCtrl.create({
      title: 'Seu cadastro está incompleto!',
      subTitle: 'Para continuar complete seus dados pessoais e endereço.',
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
    this.navCtrl.push(HomePage);
  }

}
