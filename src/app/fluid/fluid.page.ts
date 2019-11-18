/**
 * Chatter - Chat themes Ionic 4 (https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 *
 */
import {Component, HostListener, OnInit} from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';
import { HttpClient } from '@angular/common/http';
import RegExp from 'typescript-dotnet-commonjs/System/Text/RegularExpressions';

@Component({
  selector: 'app-fluid',
  templateUrl: './fluid.page.html',
  styleUrls: ['./fluid.page.scss'],
})
export class FluidPage implements OnInit {
  // @ts-ignore
  startMoment: any = new Date();

  conversation = [ { text: 'Hey, how have you been?', sender: 0, image: 'assets/images/sg2.jpg',
    img: false, minutes: this.getMinutesPassed() } ];
  options = [''];
  phone_model = 'iPhone';
  input: any = '';
  events: any;
  bot: any;
  client: any;
  firstTime = true;
  accessToken: any = '61ef5a2d7dd64ad1a24960967f8279fa';
  playerTurn: any = true;
  imagevar = 'assets/images/sg1.jpg';

  constructor(private platform: Platform,
    public alertController: AlertController, private device: Device, private menuCtrl: MenuController, private http: HttpClient) {
    this.http.get('./assets/events.json').subscribe(result => {
      this.events = result;
    });
    this.client = new ApiAiClient({
      accessToken: this.accessToken
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(true, 'start');

    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
    setTimeout(() => {
      this.presentAlert();
    }, 100);

  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    if (event.key === 'Enter' && this.playerTurn === true) {
      this.send();
    }
  }

  // @ts-ignore
  async presentAlert() {
    if (this.device.platform = 'iOS') {
      switch (this.platform.height()) {
        case 812:
          this.phone_model = 'iPhone X';
          break;
        case 736:
          this.phone_model = 'iPhone 6/7/8 Plus';
          break;
        case 667:
          this.phone_model = 'iPhone 6/7/8';
          break;
      }

      const alert = await this.alertController.create({
        header: 'Thank you for using chatter! Our brand new messaging app.',
        subHeader: 'Disclaimer',
        message: 'This app contains graphic material and strong language. Part of the conversations are machine-generated.' +
            ' By continuing you acknowledge this and confirm to be 18+. The game was originally designed to be viewed on mobile. ' +
            'If the resolutions seems off when playing on PC, please resize the window to phone format.',
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  checkStrinSubstring(string, substringArray) {
    let check = false;
    if (new RegExp(substringArray.join('|')).isMatch(string)) {
      check = true;
    }
    return check;
  }

  scrollToBottom() {
    const content = document.getElementById('chat-container');
    const parent = document.getElementById('chat-parent');
    const scrollOptions = {
      left: 0,
      top: content.offsetHeight + 40
    };

    parent.scrollTo(scrollOptions);
    setTimeout(() => {
      parent.scrollTo(scrollOptions);
    }, 500);
  }

  sendResponse(response) {
    setTimeout(() => {
      // @ts-ignore
      this.conversation.push({ text: response, sender: 0, image: 'assets/images/sg2.jpg', img: false,
          minutes: this.getMinutesPassed() });
      this.scrollToBottom();
    }, 3000);
  }

  generateRandomImage(max) {
    // @ts-ignore
    const rand = Math.floor(Math.random() * (max) + 1);
    return rand;
  }

  getMinutesPassed() {
    // @ts-ignore
    const now: any = new Date();
    let min = now.getMinutes().toString();
    if (min.length === 1) {
      min = '0' + min;
    }
    return '' + now.getHours() + ':' + min;
  }

  private send() {

  }
}
