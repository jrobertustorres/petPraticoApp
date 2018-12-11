import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
// import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { Calendar } from '@ionic-native/calendar';

//ENTITIES
import { DiaAgendaAtendimentoEntity } from '../../model/dia-agenda-atendimento-entity';
import { HorarioAtendimentoEntity } from '../../model/horario-atendimento-entity';
import { ProdutoFornecedorEntity } from '../../model/produto-fornecedor-entity';
import { HorarioAtendimentoListEntity } from '../../model/horario-atendimento-list-entity';
// import { HorarioAtendimentoListEntity } from '../../model/horario-atendimento-list-entity';

//SERVICES
import { ServicoService } from '../../providers/servico-service';

@IonicPage()
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
})
export class AgendaPage {
  tabBarElement: any;
  private loading = null;
  // public agendaForm: FormGroup;
  private idProdutoFornecedor: number;
  private nomeProduto: string;
  private valor: string;
  private diaAgendaAtendimentoEntity: DiaAgendaAtendimentoEntity;
  private horarioAtendimentoEntity: HorarioAtendimentoEntity;
  private produtoFornecedorEntity: ProdutoFornecedorEntity;
  private horarioAtendimentoListEntity: HorarioAtendimentoListEntity;
  private horarioAtendimentoList: any;
  private diaAgendaAtendimentoList: any;
  private listIdProdutoFornecedor: any[];
  private outrosServicosList: any;
  private dataAtendimento: any;
  
  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;

  diasDeAgendaServidor: any;
  // dataCompleta: any;

  eventList: any;
  selectedEvent: any;
  isSelected: any;


  constructor(public navCtrl: NavController,
              private calendar: Calendar,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              public platform: Platform,
              // private formBuilder: FormBuilder,
              public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    // this.idProdutoFornecedor = navParams.get("idProdutoFornecedor");
    this.nomeProduto = navParams.get("nomeProduto");
    this.listIdProdutoFornecedor = navParams.get("listIdProdutoFornecedor");
    this.valor = navParams.get("valor");
    this.diaAgendaAtendimentoEntity = new DiaAgendaAtendimentoEntity();
    this.horarioAtendimentoEntity = new HorarioAtendimentoEntity();
    this.produtoFornecedorEntity = new ProdutoFornecedorEntity();
    this.horarioAtendimentoListEntity = new HorarioAtendimentoListEntity();
    this.platform.registerBackButtonAction(()=>this.myHandlerFunction());

    console.log(this.listIdProdutoFornecedor);
  }

  ngOnInit() {
    // this.agendaForm = this.formBuilder.group({
    //   'idProdutoFornecedor': [''],
    // });
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
    
    this.date = new Date();
    this.monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    this.verificaHorarioAtendimento();
    // this.findProdutoFornecedorByProdutoESubGrupo();
    this.getDaysOfMonth();
    this.loadEventThisMonth();
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

    // var teste = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    // this.dataCompleta = new Date(this.date.getFullYear(), this.date.getMonth());

    console.log(this.currentMonth);
    console.log(this.currentYear);

    if(this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();      
    } else {
      this.currentDate = 999;
    }
  
    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    // console.log(new Date(this.date.getFullYear(), this.date.getMonth()));
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
    for (var i = 0; i < thisNumOfDays; i++) {
      // this.daysInThisMonth.push(i+1); // original
      let dia = i+1;
      // let dataCompleta = 
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
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getDaysOfMonth();
  }

  loadEventThisMonth() {
    this.eventList = new Array();
    var startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    var endDate = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0);
    this.calendar.listEventsInRange(startDate, endDate).then(
      (msg) => {
        msg.forEach(item => {
          this.eventList.push(item);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkEvent(day) {
    var hasEvent = false;
    var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
    this.eventList.forEach(event => {
      if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
        hasEvent = true;
      }
    });
    return hasEvent;
  }

  selectDate(day) {
    this.isSelected = false;
    this.selectedEvent = new Array();

    // this.dataCompleta = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    // this.dataCompleta = new Date(this.date.getFullYear(), this.date.getMonth())+"-"+day.dia+" 00:00:00";
    this.dataAtendimento = new Date(this.date.getFullYear(), this.date.getMonth(), day.dia);
    // this.dataCompleta = new Date(this.date.getFullYear(), this.date.getMonth());
    console.log(this.dataAtendimento);

    this.horarioAtendimentoByProdutoFornecedor();

    // Sat Dec 01 2018 00:00:00 GMT-0200 (Horário de Verão de Brasília)

    // console.log(new Date());

    // var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    // var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";

    // this.findProdutoFornecedorByProdutoESubGrupo();

    // this.day = day;
    // this.dataAtendimento = new Date(day);
    // this.dataAtendimento = new Date('Mon Dec 10 2018 15:49:27 GMT-0200 (Horário de Verão de Brasília)');

    console.log('select day ', day);
    
    // this.eventList.forEach(event => {
    //   if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
    //     this.isSelected = true;
    //     this.selectedEvent.push(event);
    //   }
    // });
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

      console.log(JSON.stringify(this.horarioAtendimentoEntity));

      this.servicoService.verificaHorarioAtendimentoByProdutoFornecedor(this.horarioAtendimentoEntity)
      .then((horarioAtendimentoResult: DiaAgendaAtendimentoEntity) => {
        this.diaAgendaAtendimentoList = horarioAtendimentoResult;

        // console.log(this.horarioAtendimentoList);

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
        // this.diasDeAgendaServidor = new Date(diaAgenda.dataAgenda);
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

        console.log(this.horarioAtendimentoList);

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

}
