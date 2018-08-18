import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

//ENTITYS
// import { ProdutoFornecedorEntity } from '../../model/produto-fornecedor-entity';
import { ProdutoFornecedorDetalheEntity } from '../../model/produto-fornecedor-detalhe-entity';
import { FavoritoEntity } from '../../model/favorito-entity';

//SERVICES
import { ProdutoService } from '../../providers/produto-service';
import { FavoritosService } from './../../providers/favoritos-service';

@IonicPage()
@Component({
  selector: 'page-detalhe-produto',
  templateUrl: 'detalhe-produto.html',
})
export class DetalheProdutoPage {
  public loading = null;
  private produtoFornecedorDetalheEntity: ProdutoFornecedorDetalheEntity;
  private favoritoEntity: FavoritoEntity;
  public idProduto: number;
  public idFornecedor: number;
  public medidasVenda: any;
  public valorInicial: string;
  public valorFrete: string;
  tabBarElement: any;
  public showIcon;
  private toastMessage: string;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private produtoService: ProdutoService,
              private favoritosService: FavoritosService,
              private toastCtrl: ToastController,
              public navParams: NavParams) {
    this.idProduto = navParams.get("idProduto");
    this.idFornecedor = navParams.get("idFornecedor");
    this.produtoFornecedorDetalheEntity = new ProdutoFornecedorDetalheEntity();
    this.favoritoEntity = new FavoritoEntity();
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

        console.log(this.produtoFornecedorDetalheEntity);
        
        this.showIcon = this.produtoFornecedorDetalheEntity.idFavoritos != null ? true : false;

        this.medidasVenda = this.produtoFornecedorDetalheEntity.listProdutoFornecedorEntities;
        this.valorInicial = this.medidasVenda[0].valor;
        this.valorFrete = this.medidasVenda[0].valorFrete;

        // $scope.medidasVenda = data.listProdutoFornecedorEntities;
        // $scope.idProdutoFornecedorInicial = $scope.medidasVenda[0].idProdutoFornecedor;
        // localStorage.setItem("idProdutoFornecedorInicial", $scope.medidasVenda[0].idProdutoFornecedor);
        // $scope.valorInicial = $scope.medidasVenda[0].valor;
        // $scope.valorFrete = $scope.medidasVenda[0].valorFrete;
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

  adicionaRemoveFavoritoDetalhes(idProduto, idFavoritos){
    try {
      this.showIcon = !this.showIcon;

      if(idFavoritos) {
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
        // this.showIcon = !this.showIcon;

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

}
