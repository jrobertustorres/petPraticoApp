import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//ENTITIES
import { ProdutoFornecedorEntity } from '../../model/produto-fornecedor-entity';

//SERVICES
import { ServicoService } from '../../providers/servico-service';
import { ProdutoService } from '../../providers/produto-service';

//PAGES
import { AgendaPage } from '../../pages/agenda/agenda';

@IonicPage()
@Component({
  selector: 'page-servicos-adicionais-list',
  templateUrl: 'servicos-adicionais-list.html',
})
export class ServicosAdicionaisListPage {
  private loading = null;
  private produtoFornecedorEntity: ProdutoFornecedorEntity;
  private idProdutoFornecedor: number;
  private idFornecedor: number;
  private outrosServicosList: any;
  public listIdProdutoFornecedor: number[] = [];
  public contador: number;
  public nomeFantasiaFornecedor: string;
  public nomeProduto: string;
  public valor: string;
  public priceTotal: number = 0;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              private produtoService: ProdutoService) {
    this.produtoFornecedorEntity = new ProdutoFornecedorEntity();
    this.idProdutoFornecedor = navParams.get("idProdutoFornecedor");
    this.idFornecedor = navParams.get("idFornecedor");
    this.nomeFantasiaFornecedor = navParams.get("nomeFantasiaFornecedor");
    this.nomeProduto = navParams.get("nomeProduto");
    this.valor = navParams.get("valor");
  }

  ngOnInit() {
    this.findProdutoFornecedorByProdutoESubGrupo();
  }
  
  ionViewWillEnter(){
    this.priceTotal = JSON.parse(this.valor);
    if (this.listIdProdutoFornecedor.indexOf(this.idProdutoFornecedor) != -1) {
      this.listIdProdutoFornecedor.splice(this.listIdProdutoFornecedor.indexOf( this.idProdutoFornecedor),1);
    }
  }

  findProdutoFornecedorByProdutoESubGrupo() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.produtoFornecedorEntity.idProdutoFornecedor = this.idProdutoFornecedor;

      this.servicoService.findProdutoFornecedorByProdutoESubGrupo(this.produtoFornecedorEntity)
      .then((outrosServicosResult: ProdutoFornecedorEntity) => {
        this.outrosServicosList = outrosServicosResult;

        // this.verificaHorarioAtendimento();
        // this.horarioAtendimentoByProdutoFornecedor();

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

  getServicos(idProdutoFornecedor) {
    if (this.listIdProdutoFornecedor.indexOf(idProdutoFornecedor) == -1) {
      this.listIdProdutoFornecedor.push(idProdutoFornecedor);
      this.contador = this.contador +1;
    }else{
      this.listIdProdutoFornecedor.splice(this.listIdProdutoFornecedor.indexOf(idProdutoFornecedor),1);
      this.contador = this.contador == 0 ? this.contador : this.contador-1;
    }

    this.calculaTotal();
  }
  
  calculaTotal() {
    let aux = 0;
    for(let i = 0; i < this.outrosServicosList.length; i++) {
      for(let j = 0; j < this.listIdProdutoFornecedor.length; j++) {
        if(this.listIdProdutoFornecedor[j] == this.outrosServicosList[i].idProdutoFornecedor) {
          this.priceTotal = (this.outrosServicosList[i].valor + aux) + JSON.parse(this.valor);
          aux = this.outrosServicosList[i].valor;
        }
      }
    }
    if(this.listIdProdutoFornecedor.length == 0) {
      this.priceTotal = JSON.parse(this.valor);
    }
  }
  
  openAgendaPage() {
    this.listIdProdutoFornecedor.push(this.idProdutoFornecedor);
    this.navCtrl.push(AgendaPage, {
      listIdProdutoFornecedor: this.listIdProdutoFornecedor,
      idFornecedor: this.idFornecedor,
      // nomeProduto: nomeProduto,
      // valor: valor,
    })
  }

}
