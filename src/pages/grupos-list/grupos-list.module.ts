import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GruposListPage } from './grupos-list';

@NgModule({
  declarations: [
    GruposListPage,
  ],
  imports: [
    IonicPageModule.forChild(GruposListPage),
  ],
})
export class GruposListPageModule {}
