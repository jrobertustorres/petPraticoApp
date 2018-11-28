import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

//ENTITYS
import { ProdutoFornecedorEntity } from '../../model/produto-fornecedor-entity';
import { ProdutoFornecedorDetalheEntity } from '../../model/produto-fornecedor-detalhe-entity';
import { FavoritoEntity } from '../../model/favorito-entity';
import { ItemPedidoEntity } from '../../model/item-pedido-entity';

//SERVICES
import { ProdutoService } from '../../providers/produto-service';
import { FavoritosService } from './../../providers/favoritos-service';
import { CarrinhoService } from '../../providers/carrinho-service';
import { Constants } from '../../app/constants';

//PAGES
import { CarrinhoPage } from '../carrinho/carrinho';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-detalhe-produto',
  templateUrl: 'detalhe-produto.html',
})
export class DetalheProdutoPage {
  public loading = null;
  private produtoFornecedorDetalheEntity: ProdutoFornecedorDetalheEntity;
  private produtoFornecedorEntity: ProdutoFornecedorEntity;
  private favoritoEntity: FavoritoEntity;
  private itemPedidoEntity: ItemPedidoEntity;
  public idProduto: number;
  public idFornecedor: number;
  public medidasVenda: any;
  public valorInicial: string;
  public valorFrete: any;
  tabBarElement: any;
  public showIcon;
  private toastMessage: string;
  private quantidade: number = 1;
  private idProdutoFornecedorInicial: number;
  private estaDisponivel: boolean;
  public showLoading: boolean = false;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private produtoService: ProdutoService,
              private favoritosService: FavoritosService,
              private carrinhoService: CarrinhoService,
              private toastCtrl: ToastController,
              public navParams: NavParams) {
    this.idProduto = navParams.get("idProduto");
    this.idFornecedor = navParams.get("idFornecedor");
    this.produtoFornecedorDetalheEntity = new ProdutoFornecedorDetalheEntity();
    this.produtoFornecedorEntity = new ProdutoFornecedorEntity();
    this.favoritoEntity = new FavoritoEntity();
    this.itemPedidoEntity = new ItemPedidoEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ngOnInit() {
    this.getDetalhesProduto();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
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

  getDetalhesProduto(){
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.produtoFornecedorDetalheEntity.idProduto = this.idProduto;
      this.produtoFornecedorDetalheEntity.idFornecedor = this.idFornecedor;
      this.produtoService.findProdutoFornecedorByProdutoEFornecedor(this.produtoFornecedorDetalheEntity)
      .then((produtoResult: ProdutoFornecedorDetalheEntity) => {
        this.produtoFornecedorDetalheEntity = produtoResult;

        this.showIcon = this.produtoFornecedorDetalheEntity.idFavoritos != null ? true : false;

        this.medidasVenda = this.produtoFornecedorDetalheEntity.listProdutoFornecedorEntities;
        this.valorInicial = this.medidasVenda[0].valor;
        this.valorFrete = this.medidasVenda[0].valorFrete;

        // $scope.medidasVenda = data.listProdutoFornecedorEntities;
        this.idProdutoFornecedorInicial = this.medidasVenda[0].idProdutoFornecedor;
        // localStorage.setItem("idProdutoFornecedorInicial", $scope.medidasVenda[0].idProdutoFornecedor);
        // $scope.valorInicial = $scope.medidasVenda[0].valor;
        // $scope.valorFrete = $scope.medidasVenda[0].valorFrete;
        // this.nomeProduto = this.dadosProduto[0].nomeProduto;
        // this.unidadeProduto = this.dadosProduto[0].unidadeProduto;
        // this.imagemProduto = this.dadosProduto[0].imagem;
        // this.menorValor = this.dadosProduto[0].menorValor;

        this.estaDisponivel = this.medidasVenda[0].disponivel;
        this.calculoIdProdutoFornecedor();

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

  subtrairProduto() {
    this.quantidade -= 1;
    this.showLoading = true;
    if (this.quantidade < 1) {
        this.quantidade = 1;
    } else {
        this.calculoIdProdutoFornecedor();
    }
  }

  addProduto() {
    this.quantidade += 1;
    this.showLoading = true;
    this.calculoIdProdutoFornecedor();
  }

  calculoIdProdutoFornecedor() {

    if(this.showLoading) {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();
    }
    // localStorage.setItem("idProdutoFornecedorInicial", idProdutoFornecedor);

    this.produtoFornecedorEntity.idProdutoFornecedor = this.idProdutoFornecedorInicial;
    this.produtoFornecedorEntity.quantidadeProduto = this.quantidade;
    // $rootScope.qtdItemCarrinho = this.quantidade;

    this.produtoService.alteraCalculoProdutoFornecedorDetalhe(this.produtoFornecedorEntity)
      .then((produtoFornecedorEntity: ProdutoFornecedorEntity) => {
      this.produtoFornecedorEntity = produtoFornecedorEntity;

      // localStorage.setItem(Constants.QTD_ITENS_CARRINHO, JSON.stringify(this.quantidade));

      this.estaDisponivel = this.produtoFornecedorEntity.disponivel;
      this.valorFrete = this.produtoFornecedorEntity.valorFrete;

      this.loading.dismiss();
      // this.showLoading = false;
      }, (err) => {
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });

  }

  adicionaRemoveFavoritoDetalhes(idProduto, idFavoritos){
    try {
      this.showIcon = !this.showIcon;

      if(!this.showIcon) {
        this.removerFavoritoDetalhes(idFavoritos);
      } else {
        this.adicionaFavoritoDetalhes(idProduto);
      }
      
    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  adicionaFavoritoDetalhes(idProduto) {

    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.favoritoEntity.idProduto = idProduto;
      this.favoritosService.adicionaFavoritos(this.favoritoEntity)
      .then((favoritoResult: FavoritoEntity) => {

        this.loading.dismiss();
        this.toastMessage = 'O produto foi adicionado aos seus favoritos!';
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

  removerFavoritoDetalhes(idFavoritos){
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.favoritoEntity.idFavoritos = idFavoritos;
      this.favoritosService.removerFavoritos(this.favoritoEntity)
      .then((favoritoResult: FavoritoEntity) => {

        this.loading.dismiss();
        this.toastMessage = 'O produto foi removido dos seus favoritos!';
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

  validaProdutoIndisponivel(idProdutoFornecedor) {
    if(this.estaDisponivel) {
      this.addCarrinho(idProdutoFornecedor);
    } else {
      const alert = this.alertCtrl.create({
        title: 'Opção indisponível!',
        subTitle: 'Ops! Esta opção não está disponível. \nSelecione outra opção.',
        buttons: ['OK']
      });
      alert.present();
    }

  }

  addCarrinho(idProdutoFornecedor) {

      try {

        if ((localStorage.getItem(Constants.ID_FORNECEDOR_ATUAL_CARRINHO) == null) || 
            this.produtoFornecedorDetalheEntity.idFornecedor == parseInt(localStorage.getItem(Constants.ID_FORNECEDOR_ATUAL_CARRINHO))) {

            this.loading = this.loadingCtrl.create({
              content: 'Adicionando...'
            });
            this.loading.present();
    
            this.itemPedidoEntity.idProdutoFornecedor = idProdutoFornecedor;
            this.itemPedidoEntity.qtdItem = this.quantidade;

            this.carrinhoService.adicionaItemPedidoCarrinho(this.itemPedidoEntity)
            .then((itemPedidoResult: ItemPedidoEntity) => {
              localStorage.setItem(Constants.QTD_ITENS_CARRINHO, JSON.stringify(itemPedidoResult.qtdItemCarrinho));
              localStorage.setItem(Constants.ID_FORNECEDOR_ATUAL_CARRINHO, JSON.stringify(itemPedidoResult.idFornecedor));
      
              this.loading.dismiss();
              this.showConfirmItemCarrinho();
              this.presentToast();
            }, (err) => {
              this.loading.dismiss();
              this.alertCtrl.create({
                subTitle: err.message,
                buttons: ['OK']
              }).present();
            });

        } else {
          this.alertaFornecedorCarrinho();
        }

      }catch (err){
        if(err instanceof RangeError){
        }
        console.log(err);
      }

  }

  alertaFornecedorCarrinho() {
      const alert = this.alertCtrl.create({
        title: 'Atenção!',
        subTitle: 'Já existe um pedido de outra loja em seu carrinho de compras. \nNão é possível inserir o produto desta loja.',
        buttons: ['OK']
      });
      alert.present();
  }

  showConfirmItemCarrinho() {
    const confirm = this.alertCtrl.create({
      title: 'Item adicionando ao carrinho',
      message: 'Você possui ' + localStorage.getItem(Constants.QTD_ITENS_CARRINHO) + ' item(s) em seu \ncarrinho de compras',
      buttons: [
        {
          text: 'VISUALIZAR CARRINHO',
          handler: () => {
            // this.navCtrl.push(CarrinhoPage);
            this.navCtrl.setRoot(CarrinhoPage);
            // this.navCtrl.parent.select(0);
          }
        },
        {
          text: 'CONTINUAR COMPRANDO',
          handler: () => {
            this.navCtrl.push(HomePage);
          }
        }
      ]
    });
    confirm.present();
  }

}
