import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, Platform } from 'ionic-angular';

//SERVICES
import { PagamentoService } from '../../providers/pagamento-service';

//ENTITIES
import { TipoPagamentoFornecedorEntity } from '../../model/tipo-pagamento-fornecedor-entity';

@IonicPage()
@Component({
  selector: 'page-modal-tipo-pagamento',
  templateUrl: 'modal-tipo-pagamento.html',
})
export class ModalTipoPagamentoPage {
  private loading = null;
  private tipoPagamentoFornecedorEntity: TipoPagamentoFornecedorEntity;
  private tiposPagamento: any;
  private idFornecedor: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private pagamentoService: PagamentoService,
              public platform: Platform,
              public viewCtrl: ViewController) {
    this.tipoPagamentoFornecedorEntity = new TipoPagamentoFornecedorEntity();
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
    this.idFornecedor = navParams.get('idFornecedor');
  }

  ngOnInit() {
    this.findFormaPagamento();
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  // se o loading estiver ativo, permite fechar o loading e voltar à tela anterior
  myHandlerFunction(){
    if(this.loading) {
      this.loading.dismiss();
      this.navCtrl.pop();
    }
  }

  findFormaPagamento() {
    
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.tipoPagamentoFornecedorEntity.idFornecedor = this.idFornecedor;
      this.pagamentoService.findTipoPagamentoFornecedorByFornecedor(this.tipoPagamentoFornecedorEntity)
      .then((tipoPagamentoResult: TipoPagamentoFornecedorEntity) => {
        this.tiposPagamento = tipoPagamentoResult;

        console.log(this.tiposPagamento);

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

  setTipoPagamento(idTipoPagamento, nomeTipoPagamento) {
    console.log(idTipoPagamento);
    this.viewCtrl.dismiss({
      idTipoPagamento: idTipoPagamento, nomeTipoPagamento: nomeTipoPagamento
    });
  }

}
