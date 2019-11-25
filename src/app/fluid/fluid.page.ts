import {Component, HostListener, OnInit} from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';
import { HttpClient } from '@angular/common/http';
import RegExp from 'typescript-dotnet-commonjs/System/Text/RegularExpressions';
import { EventService } from 'src/app/eventService';

@Component({
  selector: 'app-fluid',
  templateUrl: './fluid.page.html',
  styleUrls: ['./fluid.page.scss'],
})
export class FluidPage implements OnInit {
  // @ts-ignore
  startMoment: any = new Date();

  conversation: any = [ { text: 'Hey, how have you been?', sender: 0, image: 'assets/images/sg2.jpg',
    img: false, minutes: this.getMinutesPassed() } ];
  options: any = [''];
  phone_model = 'iPhone';
  input: any = '';
  events: any;
  bot: any;
  client: any;
  firstTime = true;
  accessToken: any = '61ef5a2d7dd64ad1a24960967f8279fa';
  playerTurn: any = true;
  lockResponse =  [false, 'Type a message'];
  imageFolder = 'assets/images/convo/';
  imagevar = 'assets/images/sg1.jpg';
  inEvent = false;
  inControl = false;
  // private story = 10;
  private story = this.generateRandomImage(2);
  private previous = 0;
  private step = 0;
  private commands: any = [];

  constructor(private platform: Platform,
    public alertController: AlertController, private device: Device, private menuCtrl: MenuController,
              private http: HttpClient, private eventService: EventService) {
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
            ' By continuing you acknowledge this and confirm to be 18+.',
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  checkStringSubstring(string, substringArray) {
    let check = false;
    if (new RegExp(substringArray.join('|')).isMatch(string)) {
      check = true;
    }
    return check;
  }

  scrollToBottom(extra?) {
    const content = document.getElementById('chat-container');
    const parent = document.getElementById('chat-parent');
    const scrollOptions = {
      left: 0,
      top: null
    };
    if(extra) {
      scrollOptions.top = content.offsetHeight + 260;
    } else {
      scrollOptions.top = content.offsetHeight + 40;
    }
    setTimeout(function() {
      parent.scrollTo(scrollOptions);
    }, 500);
  }

  private generateResponse(input) {
    if(this.input.length < 256) {
      this.client
          .textRequest(input)
          .then(response => {
            /* do something */
            this.sendResponse(response.result.fulfillment.speech);
          });
    } else {
      this.sendResponse("You can't send long messages in this app... It's kind of a bother, right");
    }
  }

  sendResponse(response) {
    let eventChain = null;
    if (this.eventService.checkevent(response, this.inEvent)) {
      setTimeout(() => {
      this.inEvent = true;
      if (this.story === 0) {
          this.story = this.previous;
          this.step = 0;
          this.previous = null;
      }
      eventChain = this.eventService.follow(this.story, this.step);
      this.sendEvent(eventChain);
      if (eventChain.ends) {
        this.playerTurn = true;
      }
    }, 3000);
    } else {
      setTimeout(() => {
        // @ts-ignore
        this.addToConversation(response, 0, false);
        this.playerTurn = true;
      }, 3000);
    }
  }

  generateRandomImage(max) {
    // @ts-ignore
    const rand = Math.floor(Math.random() * (max) + 1);
    return rand;
  }

  generateRandomNumber(min, max) {
    console.log('Selecting between: ', min, max);
      // @ts-ignore
      const rand = Math.floor(Math.random() * (max) + min);
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
    this.interceptPlayerAction();
    if(this.input === 'You start typing without noticing...') {
      this.step = this.step + 1;
      this.input = null;
      const eventChain = this.eventService.follow(this.story, this.step);
      this.playerTurn = false;
      this.lockResponse = [false, 'Type a message'];
      this.sendEvent(eventChain);
    } else if (this.commands.length > 0 && this.generateRandomNumber(1, 10) === 1) {
      if (this.inControl === false ) {
        this.previous = this.story;
      }
        const eventChain = this.eventService.checkCommand(this.commands);
        this.playerTurn = false;
        this.lockResponse = [false, 'Type a message'];
        this.input = '';
        if (this.story != 0 && this.story != eventChain.content[3]) {
            this.story = eventChain.content[3];
        }
        this.inControl = true;
        this.sendEvent(eventChain);
      } else {
      if(this.input) {
        if (this.input.length > 0) {
          this.addToConversation(this.input, 1, false);
          this.generateResponse(this.input);
          this.input = null;
          this.playerTurn = false;
          this.lockResponse = [false, 'Type a message'];
        }
      }
    }
  }

  private addToConversation( text, sender, image) {
    let avatar;
    if (sender === 0) {
      avatar = 'assets/images/sg2.jpg';
    } else {
      avatar = this.imagevar;
    }
    // @ts-ignore
    this.conversation.push({ text: text, sender: sender, image: avatar, img: image,
      minutes: this.getMinutesPassed() });
    this.lockResponse = [false, 'Type a message'];
    if(image) {
      this.scrollToBottom(true);
    } else {
      this.scrollToBottom();
    }
  }

  private sendEvent(eventChain) {
    switch (eventChain.type) {
      case 'text':
          this.addToConversation(eventChain.content[1], eventChain.content[0], false);
          if(eventChain.content[2]) {
            this.lockResponse = [true, 'You start typing without noticing...'];
            this.input = 'You start typing without noticing...';
          }
        break;
      case 'command':
        this.addToConversation(eventChain.content[1], eventChain.content[0], false);
        this.commands.push(eventChain.content[3]);
        if(eventChain.content[2]) {
          this.lockResponse = [true, 'You start typing without noticing...'];
          this.input = 'You start typing without noticing...';
        }
        break;
      case 'special_action':
        this.addToConversation(eventChain.content[1], eventChain.content[0], false);
        this.resolveAction(eventChain.content[3]);
        if(eventChain.content[2]) {
          this.lockResponse = [true, 'You start typing without noticing...'];
          this.input = 'You start typing without noticing...';
        }
        break;
      case 'gif':
        this.addToConversation((eventChain.content[1] + '_' +
            this.generateRandomImage(eventChain.content[2]).toString() + '.gif'), eventChain.content[0], true);
        break;
      case 'image':
        this.addToConversation((eventChain.content[1] + '_' +
            this.generateRandomImage(eventChain.content[2]).toString() + '.png'), eventChain.content[0], true);
        break;
    }
    if (eventChain.ends) {
      this.inEvent = false;
      this.inControl = false;
      this.selectNextEvent();
    }
    if (eventChain.pause) {
      this.playerTurn = true;
    } else {
      this.step = this.step + 1;
      setTimeout(() => {
        eventChain = this.eventService.follow(this.story, this.step);
        this.sendEvent(eventChain);
      }, 3000);
    }
  }

  private selectNextEvent() {
    const options = this.eventService.getOptions(this.story);
    const selected = this.generateRandomNumber(0, options.length);
    console.log('Next: ');
    console.log(options[selected]);
    if (options[selected] === 0) {
      this.story = this.previous;
    } else {
      this.story = options[selected];
      this.previous = this.story;
    }
    this.inControl = false;
    this.step = 0;
  }

  private resolveAction(actionId) {
    switch (actionId) {
      case 11:
        this.imageFolder = 'assets/images/convo/be/';
        break;
      case 13:
        this.imagevar = 'assets/images/sg1_be.jpg';
        break;
    }

  }

  private interceptPlayerAction() {
    switch (this.input) {
      case 'You can\'t change me!':
        this.story = 10;
        this.step = 0;
        break;
    }
  }
}
