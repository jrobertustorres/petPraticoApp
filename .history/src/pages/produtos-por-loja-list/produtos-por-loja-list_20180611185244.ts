import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//ENTITYS
import { ProdutoFornecedorEntity } from '../../model/produto-fornecedor-entity';

//SERVICES
import { ProdutoService } from '../../providers/produto-service';

//PAGES
import { DetalheProdutoPage } from '../../pages/detalhe-produto/detalhe-produto';

@IonicPage()
@Component({
  selector: 'page-produtos-por-loja-list',
  templateUrl: 'produtos-por-loja-list.html',
})
export class ProdutosPorLojaListPage {
  public idProduto: number;
  private loading = null;
  private produtoFornecedorEntity: ProdutoFornecedorEntity;
  public dadosProduto: any;
  public nomeProduto: string;
  public imagemProduto: string;
  public menorValor: string;
  public unidadeProduto: string;
  public idUsuario: string;
  tabBarElement: any;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private produtoService: ProdutoService,
              public navParams: NavParams) {
    this.idProduto = navParams.get("idProduto");
    this.produtoFornecedorEntity = new ProdutoFornecedorEntity();
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ngOnInit() {
    this.getDadosProduto();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  getDadosProduto(){
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.produtoFornecedorEntity.idProduto = this.idProduto;
      this.produtoService.findProdutoFornecedorByProduto(this.produtoFornecedorEntity)
      .then((produtoResult: ProdutoFornecedorEntity) => {
        // this.produtoFornecedorEntity = produtoResult;
        this.dadosProduto = produtoResult;
        this.nomeProduto = this.dadosProduto[0].nomeProduto;
        this.unidadeProduto = this.dadosProduto[0].unidadeProduto;
        this.imagemProduto = this.dadosProduto[0].imagem;
        this.menorValor = this.dadosProduto[0].menorValor;

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

  openDetalheProdutoPage(idProduto, idFornecedor) {
    this.navCtrl.push(DetalheProdutoPage, {
      idProduto: idProduto,
      idFornecedor: idFornecedor
    })
  }

}
