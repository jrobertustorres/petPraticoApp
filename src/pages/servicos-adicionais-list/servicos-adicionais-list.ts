import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

//ENTITIES
import { ProdutoFornecedorEntity } from '../../model/produto-fornecedor-entity';

//SERVICES
import { ServicoService } from '../../providers/servico-service';

//PAGES
import { AgendaPage } from '../../pages/agenda/agenda';

@IonicPage()
@Component({
  selector: 'page-servicos-adicionais-list',
  templateUrl: 'servicos-adicionais-list.html',
})
export class ServicosAdicionaisListPage {
  private loading = null;
  public outrosServicosForm: FormGroup;
  private produtoFornecedorEntity: ProdutoFornecedorEntity;
  private idProdutoFornecedor: number;
  private outrosServicosList: any;
  public listIdProdutoFornecedor: number[] = [];
  public contador: number;
  public nomeFantasiaFornecedor: string;
  public nomeProduto: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              private formBuilder: FormBuilder) {
    this.produtoFornecedorEntity = new ProdutoFornecedorEntity();
    this.idProdutoFornecedor = navParams.get("idProdutoFornecedor");
    this.nomeFantasiaFornecedor = navParams.get("nomeFantasiaFornecedor");
    this.nomeProduto = navParams.get("nomeProduto");
  }

  ngOnInit() {
    // this.outrosServicosForm = this.formBuilder.group({
    //   'idProdutoFornecedor': ['']
    // });
    this.findProdutoFornecedorByProdutoESubGrupo();
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

        console.log(this.outrosServicosList);

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
      this.listIdProdutoFornecedor.splice(this.listIdProdutoFornecedor.indexOf( idProdutoFornecedor),1);
      this.contador = this.contador == 0 ? this.contador : this.contador-1;
    }
  }
  
  // openAgendaPage(idProdutoFornecedor, nomeProduto, valor) {
  openAgendaPage() {
    this.listIdProdutoFornecedor.push(this.idProdutoFornecedor);
    console.log(this.idProdutoFornecedor);
    this.navCtrl.push(AgendaPage, {
      listIdProdutoFornecedor: this.listIdProdutoFornecedor,
      // idProdutoFornecedor: idProdutoFornecedor,
      // nomeProduto: nomeProduto,
      // valor: valor,
    })
  }

}
