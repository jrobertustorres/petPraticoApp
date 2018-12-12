import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform, Events } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Calendar } from '@ionic-native/calendar';

//ENTITIES
import { DiaAgendaAtendimentoEntity } from '../../model/dia-agenda-atendimento-entity';
import { HorarioAtendimentoEntity } from '../../model/horario-atendimento-entity';
import { ProdutoFornecedorEntity } from '../../model/produto-fornecedor-entity';
import { HorarioAtendimentoListEntity } from '../../model/horario-atendimento-list-entity';
import { ItemPedidoEntity } from '../../model/item-pedido-entity';
import { ItemPedidoListServicoEntity } from '../../model/item-pedido-list-servico-entity';

//SERVICES
import { ServicoService } from '../../providers/servico-service';
import { CarrinhoService } from '../../providers/carrinho-service';

@IonicPage()
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
})
export class AgendaPage {
  tabBarElement: any;
  private loading = null;
  private idProdutoFornecedor: number;
  private nomeProduto: string;
  private idFornecedor: number;
  private valor: string;
  private diaAgendaAtendimentoEntity: DiaAgendaAtendimentoEntity;
  private horarioAtendimentoEntity: HorarioAtendimentoEntity;
  private produtoFornecedorEntity: ProdutoFornecedorEntity;
  private horarioAtendimentoListEntity: HorarioAtendimentoListEntity;
  private itemPedidoEntity: ItemPedidoEntity;
  private itemPedidoListServicoEntity: ItemPedidoListServicoEntity;
  private horarioAtendimentoList: any;
  private diaAgendaAtendimentoList: any;
  private listIdProdutoFornecedor: any[];
  private outrosServicosList: any;
  private dataAtendimento: any;
  private diaDisponivel: string;
  private diaSelecionado: string;
  private dataHorarioAgenda: any;
  
  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  diasDeAgendaServidor: any;

  eventList: any;
  selectedEvent: any;
  isSelected: any;


  constructor(public navCtrl: NavController,
              private calendar: Calendar,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              private carrinhoService: CarrinhoService,
              public platform: Platform,
              private events: Events,
              public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.nomeProduto = navParams.get("nomeProduto");
    this.idFornecedor = navParams.get("idFornecedor");
    this.listIdProdutoFornecedor = navParams.get("listIdProdutoFornecedor");
    this.valor = navParams.get("valor");
    this.diaAgendaAtendimentoEntity = new DiaAgendaAtendimentoEntity();
    this.horarioAtendimentoEntity = new HorarioAtendimentoEntity();
    this.produtoFornecedorEntity = new ProdutoFornecedorEntity();
    this.horarioAtendimentoListEntity = new HorarioAtendimentoListEntity();
    this.itemPedidoEntity = new ItemPedidoEntity();
    this.itemPedidoListServicoEntity = new ItemPedidoListServicoEntity();
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
    
    this.date = new Date();
    this.monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    this.getDaysOfMonth();
    this.verificaHorarioAtendimento();
    // this.loadEventThisMonth();
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

  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();

    if(this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();      
    } else {
      this.currentDate = 999;
    }

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
    for (var i = 0; i < thisNumOfDays; i++) {
      // this.daysInThisMonth.push(i+1); // original
      let dia = i+1;
      this.daysInThisMonth.push({dia, 'seleciona': false});
      
    }

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
    var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
    for (var i = 0; i < (6-lastDayThisMonth); i++) {
      this.daysInNextMonth.push(i+1);
    }
    var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
    if(totalDays<36) {
      for(var i = (7-lastDayThisMonth); i < ((7-lastDayThisMonth)+7); i++) {
        this.daysInNextMonth.push(i);
      }
    }
  }
  
  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
    if(this.date.getMonth() === new Date().getMonth()) {
      this.verificaHorarioAtendimento();
    }
  }
  
  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getDaysOfMonth();
    if(this.date.getMonth() === new Date().getMonth()) {
      this.verificaHorarioAtendimento();
    }
  }

  // loadEventThisMonth() {
  //   this.eventList = new Array();
  //   var startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  //   var endDate = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0);
  //   this.calendar.listEventsInRange(startDate, endDate).then(
  //     (msg) => {
  //       msg.forEach(item => {
  //         this.eventList.push(item);
  //       });
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  // checkEvent(day) {
  //   var hasEvent = false;
  //   var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
  //   var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
  //   this.eventList.forEach(event => {
  //     if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
  //       hasEvent = true;
  //     }
  //   });
  //   return hasEvent;
  // }

  selectDate(day) {
    this.isSelected = false;
    this.selectedEvent = new Array();
    this.dataAtendimento = new Date(this.date.getFullYear(), this.date.getMonth(), day.dia);
    this.horarioAtendimentoByProdutoFornecedor();

    // var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day.dia+" 00:00:00";

    // console.log(thisDate1);
    // console.log(day.dia);
    // console.log(this.date.getMonth());
    this.diaSelecionado = day.dia+"/"+(this.date.getMonth()+1);
  }

  // deleteEvent(evt) {
  //   let alert = this.alertCtrl.create({
  //     title: 'Confirm Delete',
  //     message: 'Are you sure want to delete this event?',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Ok',
  //         handler: () => {
  //           this.calendar.deleteEvent(evt.title, evt.location, evt.notes, new Date(evt.startDate.replace(/\s/, 'T')), new Date(evt.endDate.replace(/\s/, 'T'))).then(
  //             (msg) => {
  //               console.log(msg);
  //               this.loadEventThisMonth();
  //               this.selectDate(new Date(evt.startDate.replace(/\s/, 'T')).getDate());
  //             },
  //             (err) => {
  //               console.log(err);
  //             }
  //           )
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  // findProdutoFornecedorByProdutoESubGrupo() {
  //   try {
  //     this.loading = this.loadingCtrl.create({
  //       content: 'Aguarde...'
  //     });
  //     this.loading.present();

  //     this.produtoFornecedorEntity.idProdutoFornecedor = this.idProdutoFornecedor;

  //     this.servicoService.findProdutoFornecedorByProdutoESubGrupo(this.produtoFornecedorEntity)
  //     .then((outrosServicosResult: ProdutoFornecedorEntity) => {
  //       this.outrosServicosList = outrosServicosResult;

  //       this.verificaHorarioAtendimento();
  //       // this.horarioAtendimentoByProdutoFornecedor();

  //       console.log(this.outrosServicosList);

  //       // this.loading.dismiss();
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

  verificaHorarioAtendimento(){
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      // let listIdProdutoFornecedorArray: number[] = [];
      // listIdProdutoFornecedorArray.push(this.idProdutoFornecedor);
      // this.horarioAtendimentoEntity.listIdProdutoFornecedor = listIdProdutoFornecedorArray;
      
      this.horarioAtendimentoEntity.listIdProdutoFornecedor = this.listIdProdutoFornecedor;

      this.servicoService.verificaHorarioAtendimentoByProdutoFornecedor(this.horarioAtendimentoEntity)
      .then((horarioAtendimentoResult: DiaAgendaAtendimentoEntity) => {
        this.diaAgendaAtendimentoList = horarioAtendimentoResult;

        this.printaCorDia();

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

  printaCorDia(){
    for (let diaCalendario of this.daysInThisMonth) {
      for (let diaAgenda of this.diaAgendaAtendimentoList) {
        this.diasDeAgendaServidor = new Date(diaAgenda.dataAgenda).getDate();
        if(diaCalendario.dia == this.diasDeAgendaServidor) {
          diaCalendario.seleciona = true;
        }
      }
    }
  }

  horarioAtendimentoByProdutoFornecedor() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.horarioAtendimentoEntity.dataAtendimento = this.dataAtendimento;
      this.horarioAtendimentoEntity.listIdProdutoFornecedor = this.listIdProdutoFornecedor;

      this.servicoService.horarioAtendimentoByProdutoFornecedor(this.horarioAtendimentoEntity)
      .then((horarioAtendimentoResult: HorarioAtendimentoListEntity) => {
        this.horarioAtendimentoList = horarioAtendimentoResult;
        this.diaDisponivel = this.horarioAtendimentoList[0].dia;

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

  selecionaHorario(horarioAtendimentoList) {
    let hora = new Date(horarioAtendimentoList.horarioAgenda).getHours();
    let date = new Date(new Date(horarioAtendimentoList.dataAgenda));
    date.setHours(hora, 0, 0);
    this.dataHorarioAgenda = date.toString();
  }

  addCarrinho() {
    try {

      if ((localStorage.getItem(Constants.ID_FORNECEDOR_ATUAL_CARRINHO) == null) || 
          this.idFornecedor == parseInt(localStorage.getItem(Constants.ID_FORNECEDOR_ATUAL_CARRINHO))) {

          this.loading = this.loadingCtrl.create({
            content: 'Adicionando...'
          });
          this.loading.present();
  
          this.itemPedidoListServicoEntity.listIdProdutoFornecedor = this.listIdProdutoFornecedor;
          this.itemPedidoListServicoEntity.dataHorarioAgenda = this.dataHorarioAgenda;

          console.log(JSON.stringify(this.itemPedidoListServicoEntity));

          this.carrinhoService.adicionaItemPedidoServicoCarrinho(this.itemPedidoListServicoEntity)
          .then((itemPedidoResult: ItemPedidoEntity) => {
            localStorage.setItem(Constants.QTD_ITENS_CARRINHO, JSON.stringify(itemPedidoResult.qtdItemCarrinho));
            localStorage.setItem(Constants.ID_FORNECEDOR_ATUAL_CARRINHO, JSON.stringify(itemPedidoResult.idFornecedor));
    
            this.loading.dismiss();
            this.showConfirmItemCarrinho();
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
    subTitle: 'Já existe itens de outra loja em seu carrinho de compras. \nFinalze a compra antes de inserir serviços desta loja.',
    buttons: ['OK']
  });
  alert.present();
}

showConfirmItemCarrinho() {
  let qtd = localStorage.getItem(Constants.QTD_ITENS_CARRINHO);
  let labelItem = parseInt(qtd) == 1 ? 'item' : 'itens';
  
  const confirm = this.alertCtrl.create({
    title: 'Item adicionando ao carrinho',
    message: 'Você possui ' + localStorage.getItem(Constants.QTD_ITENS_CARRINHO) +' '+ labelItem + ' em seu \ncarrinho de compras',
    buttons: [
      {
        text: 'VISUALIZAR CARRINHO',
        handler: () => {
          this.navCtrl.popToRoot().then(() => {
            this.events.publish('fromDetalhe:go');
            let currentIndex = this.navCtrl.getActive().index;
            this.navCtrl.parent.select(2).then(() => {
            });
          });

        }
      },
      {
        text: 'CONTINUAR COMPRANDO',
        handler: () => {
          this.navCtrl.popToRoot().then(() => {
            this.events.publish('fromDetalhe:go');
            let currentIndex = this.navCtrl.getActive().index;
            this.navCtrl.parent.select(0).then(() => {
              console.log(currentIndex);
            });
          });
        }
      }
    ]
  });
  confirm.present();
}

  continuarCarrinho() {
    // this.navCtrl.push(PagamentoPage, {idPedido: this.meusPedidoEntity.idPedido, idFornecedor: this.meusPedidoEntity.idFornecedor});
  }

}
