import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSobrePage } from './modal-sobre';

@NgModule({
  declarations: [
    ModalSobrePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalSobrePage),
  ],
})
export class ModalSobrePageModule {}
