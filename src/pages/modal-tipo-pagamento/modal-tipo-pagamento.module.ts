import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalTipoPagamentoPage } from './modal-tipo-pagamento';

@NgModule({
  declarations: [
    ModalTipoPagamentoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalTipoPagamentoPage),
  ],
})
export class ModalTipoPagamentoPageModule {}
