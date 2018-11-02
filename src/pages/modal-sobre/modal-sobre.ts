import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { Constants } from '../../app/constants';

@IonicPage()
@Component({
  selector: 'page-modal-sobre',
  templateUrl: 'modal-sobre.html',
})
export class ModalSobrePage {
  public versaoApp: string;

  constructor(public viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  openSite() {
    window.open('http://www.logiic.com.br/', '_system', 'location=yes');
  }

}
