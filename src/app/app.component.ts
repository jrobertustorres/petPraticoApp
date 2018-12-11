import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';
import { Constants } from '../app/constants';
import { Network } from '@ionic-native/network';
import { Device } from '@ionic-native/device';
import { Push, PushObject, PushOptions} from '@ionic-native/push';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(public platform: Platform, 
              public statusBar: StatusBar,
              private appVersion: AppVersion,
              private network: Network,
              public alertCtrl: AlertController,
              private device: Device,
              public push: Push,
              splashScreen: SplashScreen) {
    this.platform.ready().then(() => {
      //desabilitando o botão voltar do android
      // this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
      // aqui checamos a conexão ao entrar no app
      this.checkNetwork();
      if (this.platform.is('cordova')) {
        localStorage.setItem(Constants.UUID, this.device.uuid);
        this.appVersion.getVersionNumber().then((version) => {
          localStorage.setItem(Constants.VERSION_NUMBER, version);
        })
      }
      statusBar.styleDefault();
      splashScreen.hide();

      this.pushSetup();

      // abaixo verificamos se a intenet cair depois que o cliente já entrou no app
      this.network.onDisconnect().subscribe(() => {
        let alertDisconect = this.alertCtrl.create({
          title: "Conexão de internet!",
          subTitle: "Você está offline. Verifique sua conexão de rede!",
          buttons: [{
             text: 'Ok',
             handler: () => {
                 this.platform.exitApp();
                }
             }]
           });
           alertDisconect.present();
      });

    });
  }

  //desabilitando o botão voltar do android
  // myHandlerFunction(){}

  pushSetup() {
    const options: PushOptions = {
      android: {
          senderID: '319096550167'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'true'
      },
      windows: {}
    };

  const pushObject: PushObject = this.push.init(options);

  pushObject.on('registration').subscribe((registration: any) => {
    localStorage.setItem(Constants.TOKEN_PUSH, registration.registrationId);
  });

  pushObject.on('notification').subscribe((data: any) => {
    if (data.additionalData.foreground) {
      let confirmAlert = this.alertCtrl.create({
        title: 'Nova notificação',
        message: data.message,
        buttons: [{
          text: 'IGNORAR',
          role: 'cancel'
        }, {
          text: 'ENTRAR ',
          handler: () => {
            // this.nav.push(HomePage);
            // this.nav.parent.select(0);
          }
        }]
      });
      confirmAlert.present();
    } else {
      // this.nav.push(HomePage);
    }
  });

    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }

  checkNetwork() {
    if(this.network.type === 'none') {
      let alert = this.alertCtrl.create({
      title: "Conexão de internet!",
      subTitle: "Você está offline. Verifique sua conexão de rede!",
      buttons: [{
         text: 'Ok',
         handler: () => {
             this.platform.exitApp();
            }
         }]
       });
     alert.present();
    }
  }

}
