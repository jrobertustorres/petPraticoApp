import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//SERVICES
import { ProdutoService } from '../../providers/produto-service';

//ENTITYS
import { ProdutoEntity } from '../../model/produto-entity';

//PAGES
import { ProdutosPorLojaListPage } from '../produtos-por-loja-list/produtos-por-loja-list';

@IonicPage()
@Component({
  selector: 'page-modal-busca-produtos',
  templateUrl: 'modal-busca-produtos.html',
})
export class ModalBuscaProdutosPage {
  public loading = null;
  private produtoEntity: ProdutoEntity;
  private produtosList: any;
  public nomeProduto: string;
  private refresh: boolean = false;
  tabBarElement: any;
  public idUsuarioLogado: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private produtoService: ProdutoService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    this.produtoEntity = new ProdutoEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ngOnInit() {
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  loadMore(infiniteScroll) {

    setTimeout(() => {

      this.getProdutoByNomeList(this.nomeProduto);
      infiniteScroll.complete();
    }, 500);
  }
  
  getProdutoByNomeList(nomeProduto){

    try {
      this.nomeProduto = nomeProduto;

      if (this.nomeProduto) {
            
        this.produtoEntity.limiteDados = this.produtoEntity.limiteDados ? this.produtosList.length : null;
        this.produtoEntity.produto = this.nomeProduto;

          if(this.refresh == false) {
            this.loading = this.loadingCtrl.create({
              content: 'Aguarde...'
            });
            this.loading.present();
          }

          this.produtoService.findProdutoByNome(this.produtoEntity)
          .then((produtoResult: ProdutoEntity) => {
            this.produtosList = produtoResult;
            this.produtoEntity.limiteDados = this.produtosList.length;

            this.refresh = true;
            this.loading ? this.loading.dismiss() : '';
            // this.loading.dismiss();
          }, (err) => {
            this.loading ? this.loading.dismiss() : '';
            // this.loading.dismiss();
            this.alertCtrl.create({
              subTitle: err.message,
              buttons: ['OK']
            }).present();
          });

      } else {
        this.showAlert();
      }
    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }

  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Buscar produto!',
      subTitle: 'Favor informar algum produto no campo de Busca!',
      buttons: ['OK']
    });
    alert.present();
  }

  openProdutosPorLojaListPage(idProduto) {
    this.navCtrl.push(ProdutosPorLojaListPage, {
      idProduto: idProduto
    })
  }

}
