import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { Constants } from '../../app/constants';

//ENTITYS
import { ProdutoFornecedorEntity } from '../../model/produto-fornecedor-entity';

//SERVICES
import { ProdutoService } from '../../providers/produto-service';

//PAGES
import { DetalheProdutoPage } from '../../pages/detalhe-produto/detalhe-produto';
import { ServicosAdicionaisListPage } from '../../pages/servicos-adicionais-list/servicos-adicionais-list';
// import { AgendaPage } from '../../pages/agenda/agenda';

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
  public isProduto: boolean;
  public unidadeProduto: string;
  public idUsuario: string;
  public nomeFantasiaFornecedor: string;
  tabBarElement: any;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private produtoService: ProdutoService,
              public platform: Platform,
              public navParams: NavParams) {
    this.idProduto = navParams.get("idProduto");
    this.produtoFornecedorEntity = new ProdutoFornecedorEntity();
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
  }

  ngOnInit() {
    this.getLojasPorProdutoList();
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

  getLojasPorProdutoList(){
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.produtoFornecedorEntity.idProduto = this.idProduto;

      this.produtoService.findProdutoFornecedorByProduto(this.produtoFornecedorEntity)
      .then((produtoResult: ProdutoFornecedorEntity) => {
        this.dadosProduto = produtoResult;
        this.nomeProduto = this.dadosProduto[0].nomeProduto;
        this.unidadeProduto = this.dadosProduto[0].unidadeProduto;
        this.imagemProduto = this.dadosProduto[0].imagem;
        this.menorValor = this.dadosProduto[0].menorValor;
        this.isProduto = this.dadosProduto[0].isProduto;
        this.nomeFantasiaFornecedor = this.dadosProduto[0].nomeFantasiaFornecedor;

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

  verificaProdutoServico(idProduto, idFornecedor, idProdutoFornecedor, nomeProduto, valor, isProduto) {
    if (isProduto) {
      this.openDetalheProdutoPage(idProduto, idFornecedor);
    } else {
      this.openServicosAdicionaisPage(idProdutoFornecedor, nomeProduto, valor, idFornecedor);
      // this.openAgendaPage(idProdutoFornecedor, nomeProduto, valor);
    }
  }

  openDetalheProdutoPage(idProduto, idFornecedor) {
    this.navCtrl.push(DetalheProdutoPage, {
      idProduto: idProduto,
      idFornecedor: idFornecedor
    })
  }

  openServicosAdicionaisPage(idProdutoFornecedor, nomeProduto, valor, idFornecedor) {
    this.navCtrl.push(ServicosAdicionaisListPage, {
      idProdutoFornecedor: idProdutoFornecedor,
      nomeFantasiaFornecedor: this.nomeFantasiaFornecedor,
      nomeProduto: nomeProduto,
      valor: valor,
      idFornecedor: idFornecedor
    })
  }

  // openAgendaPage(idProdutoFornecedor, nomeProduto, valor) {
  //   this.navCtrl.push(AgendaPage, {
  //     idProdutoFornecedor: idProdutoFornecedor,
  //     nomeProduto: nomeProduto,
  //     valor: valor
  //   })
  // }

}
