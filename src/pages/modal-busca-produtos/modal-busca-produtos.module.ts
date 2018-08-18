import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalBuscaProdutosPage } from './modal-busca-produtos';

@NgModule({
  declarations: [
    ModalBuscaProdutosPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalBuscaProdutosPage),
  ],
})
export class ModalBuscaProdutosPageModule {}
