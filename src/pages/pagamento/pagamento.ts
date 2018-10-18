import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { FormBuilder,	FormGroup } from '@angular/forms';

// //ENTITIES
// import { TipoPagamentoFornecedorEntity } from '../../model/tipo-pagamento-fornecedor-entity';

//SERVICES
import { PagamentoService } from '../../providers/pagamento-service';

import { ModalTipoPagamentoPage } from '../../pages/modal-tipo-pagamento/modal-tipo-pagamento';

@IonicPage()
@Component({
  selector: 'page-pagamento',
  templateUrl: 'pagamento.html',
})
export class PagamentoPage {
  public loading = null;
  private idPedido: number;
  private idFornecedor: number;
  // private tipoPagamentoFornecedorEntity: TipoPagamentoFornecedorEntity;
  private tipoEntrega: any;
  // private tiposPagamento: any;
  tabBarElement: any;
  public pagamentoForm: FormGroup;
  public idTipoPagamento: string;
  public nomeTipoPagamento: string;
  public dadosTipoPagamento = {'idTipoPagamento': this.idTipoPagamento, 'nomeTipoPagamento': this.nomeTipoPagamento};

  constructor(public navCtrl: NavController, 
              private pagamentoService: PagamentoService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private formBuilder: FormBuilder,
              public modalCtrl: ModalController,
              public navParams: NavParams) {
    this.idPedido = navParams.get('idPedido');
    this.idFornecedor = navParams.get('idFornecedor');
    // this.tipoPagamentoFornecedorEntity = new TipoPagamentoFornecedorEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }
  
  ngOnInit() {
    // this.pagamentoForm = this.formBuilder.group({
    //   'idTipoEntrega': ['', Validators.required],
    //   'idTipoPagamento': ['', Validators.required],
    // });

    this.getTipoEntrega();
    // this.findFormaPagamento();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  getTipoEntrega() {
    this.tipoEntrega = [
      { idTipoEntrega: "ENTREGA_ECONOMICA", nomeTipoEntrega: "Receba em casa", checked: true },
      { idTipoEntrega: "RETIRA_LOJA", nomeTipoEntrega: "Retire na loja", checked: false }
    ];
  }

  showModalTipoPagamento(){
    let modal = this.modalCtrl.create(ModalTipoPagamentoPage, { idFornecedor: this.idFornecedor });
    // this.select.close(); // fecha o select da marca

    modal.onDidDismiss((data) => {
      if (data) {
        console.log(data);
        // this.idTipoPagamento = data.idTipoPagamento;
        this.dadosTipoPagamento = data;
      }
    });

    modal.present();
  }

  // findFormaPagamento() {
    
  //   try {
  //     // if(this.showLoading == true) {
  //       this.loading = this.loadingCtrl.create({
  //         content: 'Aguarde...'
  //       });
  //       this.loading.present();
  //     // }

  //     this.tipoPagamentoFornecedorEntity.idFornecedor = this.idFornecedor;
  //     this.pagamentoService.findTipoPagamentoFornecedorByFornecedor(this.tipoPagamentoFornecedorEntity)
  //     .then((tipoPagamentoResult: TipoPagamentoFornecedorEntity) => {
  //       this.tiposPagamento = tipoPagamentoResult;

  //       console.log(this.tiposPagamento);

  //       this.loading.dismiss();
  //     }, (err) => {
  //       this.loading.dismiss();
  //       this.alertCtrl.create({
  //         subTitle: err.message,
  //         buttons: ['OK']
  //       }).present();
  //     });

  //   }catch (err){
  //     if(err instanceof RangeError){
  //     }
  //     console.log(err);
  //   }
  // }

  requerTroco() {
    const confirm = this.alertCtrl.create({
      title: 'Troco',
      message: 'Você precisa de troco?',
      buttons: [
        {
          text: 'NÃO  ',
          handler: () => {
          }
        },
        {
          text: 'SIM',
          handler: () => {
            this.showImputTroco();
          }
        }
      ]
    });
    confirm.present();

  }

  showImputTroco() {
    const prompt = this.alertCtrl.create({
      title: 'Informe o valor',
      message: "Troco para quanto?",
      inputs: [
        {
          name: 'troco',
          placeholder: 'digite o valor'
        },
      ],
      buttons: [
        {
          text: 'CANCELAR',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'SALVAR',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

}
