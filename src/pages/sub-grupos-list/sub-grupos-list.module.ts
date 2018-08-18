import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubGruposListPage } from './sub-grupos-list';

@NgModule({
  declarations: [
    SubGruposListPage,
  ],
  imports: [
    IonicPageModule.forChild(SubGruposListPage),
  ],
})
export class SubGruposListPageModule {}
