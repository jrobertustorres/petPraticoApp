import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgendaDetalhePage } from './agenda-detalhe';

@NgModule({
  declarations: [
    AgendaDetalhePage,
  ],
  imports: [
    IonicPageModule.forChild(AgendaDetalhePage),
  ],
})
export class AgendaDetalhePageModule {}
