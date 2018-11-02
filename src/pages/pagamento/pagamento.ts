import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController, ToastController } from 'ionic-angular';
import { FormBuilder,	FormGroup } from '@angular/forms';
import { Constants } from '../../app/constants';

// //ENTITIES
import { PedidoEntity } from '../../model/pedido-entity';

//SERVICES
import { PagamentoService } from '../../providers/pagamento-service';
import { PedidoService } from '../../providers/pedido-service';

//PAGES
import { ModalTipoPagamentoPage } from '../../pages/modal-tipo-pagamento/modal-tipo-pagamento';
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
  selector: 'page-pagamento',
  templateUrl: 'pagamento.html',
})
export class PagamentoPage {
  public loading = null;
  private idPedido: number;
  private idFornecedor: number;
  private pedidoEntity: PedidoEntity;
  private tipoEntrega: any;
  private formaPagamento: any;
  tabBarElement: any;
  public pagamentoForm: FormGroup;
  public idTipoPagamento: number = 0;
  public idTipoEntrega: string = 'ENTREGA_ECONOMICA';
  public idFormaPagamento: number;
  public nomeTipoPagamento: string;
  private troco: string;
  private classError: boolean;
  public dadosTipoPagamento = {'idTipoPagamento': this.idTipoPagamento, 'nomeTipoPagamento': this.nomeTipoPagamento};

  constructor(public navCtrl: NavController, 
              private pagamentoService: PagamentoService,
              private pedidoService: PedidoService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private formBuilder: FormBuilder,
              public modalCtrl: ModalController,
              private toastCtrl: ToastController,
              public navParams: NavParams) {
    this.idPedido = navParams.get('idPedido');
    this.idFornecedor = navParams.get('idFornecedor');
    this.pedidoEntity = new PedidoEntity();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }
  
  ngOnInit() {
    this.getTipoEntrega();
    this.getTipoPagamento();
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
      message: 'Seu pedido foi enviado para a loja. Aguarde a entrega.',
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  getTipoEntrega() {
    this.tipoEntrega = [
      { idTipoEntrega: "ENTREGA_ECONOMICA", nomeTipoEntrega: "Receba em casa", checked: "true" },
      { idTipoEntrega: "RETIRA_LOJA", nomeTipoEntrega: "Retire na loja", checked: "false" }
    ];
  }

  getTipoPagamento() {
    this.formaPagamento = [
      { idFormaPagamento: "0", nomeFormaPagamento: "Cartão", checked: "true" },
      { idFormaPagamento: "1", nomeFormaPagamento: "Dinheiro", checked: "false" }
    ];
  }

  getFormaPagamento(idFormaPagamento) {
    if (idFormaPagamento == '0') {
      this.showListCards();
      this.troco = null;
    } else {
      this.requerTroco();
      this.dadosTipoPagamento = {'idTipoPagamento': this.idTipoPagamento, 'nomeTipoPagamento': this.nomeTipoPagamento};
    }
    this.idFormaPagamento = idFormaPagamento;
  }

  showListCards() {
    let modal = this.modalCtrl.create(ModalTipoPagamentoPage, { idFornecedor: this.idFornecedor });
    modal.onDidDismiss((data) => {
      if (data) {
        this.dadosTipoPagamento = data;
        this.classError = false;
      }
    });

    modal.present();
  }

  requerTroco() {
    const confirm = this.alertCtrl.create({
      title: 'Troco',
      message: 'Você precisa de troco?',
      buttons: [
        {
          text: 'NÃO  ',
          handler: () => {
            this.troco = '0';
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
          }
        },
        {
          text: 'SALVAR',
          handler: data => {
            this.troco = data.troco;
          }
        }
      ]
    });
    prompt.present();
  }

  radioChecked(idTipoEntrega) {
    this.idTipoEntrega = idTipoEntrega;
  }

  confirmaEnvioPedido() {

    if(!this.idFormaPagamento) {
      this.classError = true;
    } else {

      const confirm = this.alertCtrl.create({
        title: 'Enviar Pedido',
        message: 'Deseja enviar o pedido?',
        buttons: [
          {
            text: 'CANCELAR',
            handler: () => {
            }
          },
          {
            text: 'ENVIAR',
            handler: () => {
              this.classError = false;
              this.submeterPedido();
            }
          }
        ]
      });
      confirm.present();
    }
  }

  submeterPedido() {
    this.pedidoEntity.idPedido = this.idPedido;
    this.pedidoEntity.trocoPedido = this.troco;
    this.pedidoEntity.tipoEntrega = this.idTipoEntrega;
    this.pedidoEntity.idTipoPagamento = this.dadosTipoPagamento.idTipoPagamento;

    try {

      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

        this.pedidoService
        .concluiPedidoCarrinho(this.pedidoEntity)
        .then((pedidoEntityResult: PedidoEntity) => {

        localStorage.removeItem(Constants.QTD_ITENS_CARRINHO);
        localStorage.removeItem(Constants.ID_FORNECEDOR_ATUAL_CARRINHO);
      
        this.loading.dismiss();
        this.presentToast();
        setTimeout(() => {
          this.navCtrl.setRoot(HomePage);
        }, 2000);
      }, (err) => {
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });
        
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }

  }

}
