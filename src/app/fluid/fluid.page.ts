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
  startMoment: any = new Date();

  conversation = [ { text: 'Hey, how have you been?', sender: 0, image: 'assets/images/sg2.jpg',
    img: false, minutes: this.getMinutesPassed() } ];
  phone_model = 'iPhone';
  input: any = '';
  events: any;
  bot: any;
  client: any;
  firstTime = true;
  accessToken: any = '61ef5a2d7dd64ad1a24960967f8279fa';
  defaultResponses: any = ['Would you have a look at this', 'Here, look at this', 'Check this out:', 'Look at this',
    'I wanted to show you something', 'Hey wanna see something cool?', 'Look at this for a minute, ok?',
  'Good girl', 'Very well...', 'Good, Pet', 'Very good, slave', '??', 'Please relax'];
  hornyString: any = ['I am soooo horny', 'i am horny', 'I am horny', 'im horny', 'horny', 'Horny', 'so horny',
    'i want to play', 'i miss you', 'I miss you', 'im so horny', 'im soo horny', 'i need you'];
  hypnoString: any = ['hypnotize me. Please', 'Master, hypnotize me', 'Hypnotize me. Please', 'Master, Hypnotize me',
    'Hypnotize me', 'hypnotize me'];
  currentEvent: any = null;
  eventStep: any = null;
  playerTurn: any = true;
  activeTriggers: any = [];
  endTriggers: any = 3;
  previousEvents: any = [0];
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

  send() {
   if (this.currentEvent !== null) {
    this.resolveResponse();
  } else {
    switch (this.input) {
      case 'I can\'t stop thinking about you':
      if (!this.activeTriggers.includes('masturbate')) {
        this.activeTriggers.push('masturbate');
      }
      break;
      case 'You are my master':
      if (!this.activeTriggers.includes('call_master')) {
        this.activeTriggers.push('call_master');
      }
      break;
      case 'I need your guidence':
      if (!this.activeTriggers.includes('ask_hypnosis')) {
        this.activeTriggers.push('ask_hypnosis');
      }
      break;
      case 'I am your slave':
      if (!this.activeTriggers.includes('call_slave')) {
        this.activeTriggers.push('call_slave');
      }
      break;
    }
    if (this.input !== '') {
      this.playerTurn = false;
      if (this.activeTriggers.includes('ask_hypnosis')) {
        if (this.generateRandomImage(8) === 8) {
          this.input = 'hypnotize me. Please';
        }
      }
      let sendPic: any = false;
      if (this.activeTriggers.includes('masturbate')) {
        if (this.generateRandomImage(5) === 5) {
          this.input = 'I am so horny. I can\'t stop thinking about you';
          sendPic = [['sexy', 2], ['nude', 5], ['present', 3], ['masturbate', 10]];
        }
      }
      if (this.activeTriggers.includes('call_master')) {
        this.input = 'Master, ' + this.input;
      }
      if (this.activeTriggers.includes('call_slave')) {
        this.input = this.input.replace(' I ', ' This slave ');
        this.input = this.input.replace('I ', 'This slave ');
        this.input = this.input.replace('Im ', 'This slave is ');
        this.input = this.input.replace(' i ', ' this slave ');
        this.input = this.input.replace('i ', 'this slave ');
        this.input = this.input.replace('im ', 'this slave is ');
        this.input = this.input.replace(' am ', ' is ');
      }
      this.conversation.push({text: this.input, sender: 1, image: this.imagevar, img: false,
          minutes: this.getMinutesPassed()});
      if (this.checkStrinSubstring(this.input, this.hornyString)) {
          this.conversation.push({text: 'horny_' + this.generateRandomImage(3).toString() + '.png',
            sender: 1, image: this.imagevar, img: true, minutes: this.getMinutesPassed()});
      }

      if (this.checkStrinSubstring(this.input, this.hypnoString)) {
          this.conversation.push({text: 'hypnotize_me_' + this.generateRandomImage(1).toString() +
            '.png', sender: 1, image: this.imagevar, img: true, minutes: this.getMinutesPassed()});
      }

      if (sendPic) {
        sendPic.forEach((picture, index) => {
          setTimeout(() => {
          this.conversation.push({text: picture[0] + '_' + this.generateRandomImage(picture[1]).toString() +
                '.png', sender: 1, image: this.imagevar, img: true, minutes: this.getMinutesPassed()});
            this.scrollToBottom();
          }, 800 * index);
        });
      }

      const message = this.input;
      this.input = '';
      this.generateMessage(message);
      setTimeout(() => {
        this.scrollToBottom();
      }, 500);
    }
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

  generateMessage(input) {
    if (this.activeTriggers.length >= this.endTriggers) {
      this.endContent();
    } else {
      if (this.currentEvent !== null) {
        console.log('Resolve active event');
        this.resolveEvent();
      } else {
        input = input.replace('Master', '');
        input = input.replace('master', '');
        this.client
            .textRequest(input)
            .then(response => {
              /* do something */
              this.sendResponse(response.result.fulfillment.speech);
              if (this.checkDefault(response.result.fulfillment.speech)) {
                setTimeout(() => {
                  this.resolveEvent();
                  this.scrollToBottom();
                }, 5000);
              } else {
                setTimeout(() => {
                  this.playerTurn = true;
                  this.scrollToBottom();
                }, 3000);
              }
            })
            .catch(error => {
              /* do something here too */
              this.conversation.push({
                text: 'I don\'t understand...', sender: 0, image: 'assets/images/sg2.jpg',
                img: false, minutes: this.getMinutesPassed()
              });
              this.playerTurn = true;
            });
      }
    }
  }

  checkDefault(response) {
    let check = false;
      if (this.defaultResponses.includes(response)) {
        check = true;
        let rand;
        if (this.firstTime) {
          console.log('First time event');
          rand = 0;
          this.firstTime = false;
        } else {
          console.log('generating event');
          rand = this.generateEventCode(this.events.events.length);
        }
          this.currentEvent = this.events.events[rand];
        //this.currentEvent = this.events.events[14];
          this.eventStep = 0;
      }
      return check;
  }

  sendResponse(response) {
    setTimeout(() => {
      this.conversation.push({ text: response, sender: 0, image: 'assets/images/sg2.jpg', img: false,
          minutes: this.getMinutesPassed() });
      this.scrollToBottom();
    }, 3000);
  }

  resolveEvent() {
    this.scrollToBottom();
    let active;
    for (let i = 0; i < this.events.events.length; i++) {
      if (this.events.events[i].id.toString() === this.currentEvent.id.toString()) {
        active = this.events.events[i];
      }
    }
    switch (active.eventText[this.eventStep][1]) {
      case 'text':
        this.sendResponse(active.eventText[this.eventStep][2]);
        this.scrollToBottom();
        break;
      case 'command':
        this.sendResponse(active.eventText[this.eventStep][2]);
        this.resolveCommand(active.eventText[this.eventStep][5]);
        this.scrollToBottom();
        break;
      case 'image':
        this.conversation.push({ text: active.eventText[this.eventStep][2] + '_' +
                this.generateRandomImage(active.eventText[this.eventStep][4]).toString() + '.png', sender: 0,
            image: 'assets/images/sg2.jpg', img: true, minutes: this.getMinutesPassed() });
        this.scrollToBottom();
        break;
      case 'gif':
        this.conversation.push({ text: active.eventText[this.eventStep][2] + '_' +
                this.generateRandomImage(active.eventText[this.eventStep][4]).toString() + '.gif', sender: 0,
            image: 'assets/images/sg2.jpg', img: true, minutes: this.getMinutesPassed() });
        this.scrollToBottom();
        break;
      case 'end':
        this.previousEvents.push(this.currentEvent.id);
        this.checkRemoval(active.id, active.eventText[this.eventStep][2]);
        this.currentEvent = null;
        active = null;
        this.eventStep = null;
        this.playerTurn = true;
        this.scrollToBottom();
        break;
    }
    this.input = '';
    if (active.eventText[this.eventStep][5]) {
      this.activeTriggers.push(active.eventText[this.eventStep][5]);
    }
    if (active.eventText[this.eventStep][1] !== 'end') {
      if (active.eventText[this.eventStep][3]) {
        setTimeout(() => {
          this.resolveEvent();
          this.scrollToBottom();
        }, 4000);
      } else {
        setTimeout(() => {
          this.playerTurn = true;
        }, 3000);
      }
      this.eventStep = this.eventStep + 1;
    }
    this.scrollToBottom();
  }


  private resolveResponse() {
    this.scrollToBottom();
    let active;
    for (let i = 0; i < this.events.events.length; i++) {
      if (this.events.events[i].id.toString() === this.currentEvent.id.toString()) {
        active = this.events.events[i];
      }
    }
    switch (active.eventText[this.eventStep][1]) {
      case 'text':
        this.conversation.push({ text: active.eventText[this.eventStep][2], sender: 1,
            image: this.imagevar, img: false, minutes: this.getMinutesPassed() });
        this.scrollToBottom();
        break;
      case 'image':
        this.conversation.push({ text: active.eventText[this.eventStep][2] + '_' +
              this.generateRandomImage(active.eventText[this.eventStep][4]).toString() + '.png',
          sender: 1, image: this.imagevar, img: true, minutes: this.getMinutesPassed() });
        this.scrollToBottom();
        break;
      case 'gif':
        this.conversation.push({ text: active.eventText[this.eventStep][2] + '_' +
              this.generateRandomImage(active.eventText[this.eventStep][4]).toString() + '.gif',
          sender: 1, image: this.imagevar, img: true, minutes: this.getMinutesPassed() });
        this.scrollToBottom();
        break;
      case 'end':
        this.previousEvents.push(this.currentEvent.id);
        this.checkRemoval(active.id, active.eventText[this.eventStep][2]);
        this.currentEvent = null;
        active = null;
        this.eventStep = null;
        this.scrollToBottom();
        break;
    }
    this.input = '';
    if (active.eventText[this.eventStep][1] !== 'end') {
      if (active.eventText[this.eventStep][3]) {
        this.playerTurn = false;
        setTimeout(() => {
          this.resolveEvent();
          this.scrollToBottom();
        }, 4000);
      }
      this.eventStep = this.eventStep + 1;
    }
    this.scrollToBottom();
  }

  generateRandomImage(max) {
    const rand = Math.floor(Math.random() * (max) + 1);
    return rand;
  }

  private checkRemoval(id: any, remove: any) {
    if (remove) {
      console.log('removing event from flow');
      this.events.events.splice((id - 1), 1);
      console.log(this.events.events);
    }
  }

  getMinutesPassed() {
    const now: any = new Date();
    let min = now.getMinutes().toString();
    if (min.length === 1) {
      min = '0' + min;
    }
    return '' + now.getHours() + ':' + min;
  }

  generateEventCode(max) {
    let randomNumber = 0;
    randomNumber = Math.floor(Math.random() * (max)) + 1;
    if (this.previousEvents.includes(randomNumber)) {
      randomNumber = Math.floor(Math.random() * (max)) + 1;
    }
    return randomNumber;
  }

  endContent() {
    setTimeout(() => {
      this.conversation.push({text: 'Good girl', sender: 0, image: 'assets/images/sg2.jpg',
        img: false, minutes: this.getMinutesPassed()});
      this.scrollToBottom();
      setTimeout(() => {
        this.conversation.push({text: 'Your programming has come along very nicely', sender: 0, image: 'assets/images/sg2.jpg',
          img: false, minutes: this.getMinutesPassed()});
        this.scrollToBottom();
        setTimeout(() => {
          this.conversation.push({text: 'Lets continue our game at my place.', sender: 0, image: 'assets/images/sg2.jpg',
            img: false, minutes: this.getMinutesPassed()});
          this.scrollToBottom();
          setTimeout(() => {
            this.conversation.push({text: 'Stay there, slave. Ill be right there to get you.', sender: 0, image: 'assets/images/sg2.jpg',
              img: false, minutes: this.getMinutesPassed()});
            this.scrollToBottom();
            setTimeout(() => {
              this.conversation.push({text: 'You are mine now', sender: 0, image: 'assets/images/sg2.jpg',
                img: false, minutes: this.getMinutesPassed()});
              this.conversation.push({text: 'hypnotize_me_' + this.generateRandomImage(1).toString() +
              '.png', sender: 0, image: 'assets/images/sg2.jpg',
                img: true, minutes: this.getMinutesPassed()});
              this.scrollToBottom();
            }, 4000);
          }, 4000);
        }, 4000);
      }, 4000);
    }, 4000);
    this.playerTurn = false;
  }
  private resolveCommand(command) {
    console.log('here');
    switch (command) {
      case 'profile':
          console.log('did');
          this.imagevar = 'assets/images/convo/profilepic_' + this.generateRandomImage(4) + '.png';
        break;
    }
  }
}
