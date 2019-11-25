import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    events: any;
    defaultResponses: any = ['Would you have a look at this', 'Here, look at this', 'Check this out:', 'Look at this',
        'I wanted to show you something', 'Hey wanna see something cool?', 'Look at this for a minute, ok?',
        'Good girl', 'Very well...', 'Good, Pet', 'Very good, slave', 'Please relax'];

    constructor(private http: HttpClient) {
        this.http.get('./assets/events.json').subscribe(result => {
            this.events = result;
        });
    }

    checkevent (response, inEvent) {
        if (inEvent) {
        return true;
        } else if (this.defaultResponses.includes(response)) {
            return true;
        } else {
            return false;
        }
    }

    follow (story, step) {
        const event = this.getEvent(story, step);
        const respObject = {'story': story, 'step': step, 'type': event[1], 'content': event[2], 'pause': event[3], 'ends': event[4]};
        return respObject;
    }

    private getEvent(story, step) {
        let returnStep;
        let active;
        for (let i = 0; i < this.events.events.length; i++) {
            if (this.events.events[i].id.toString() === story.toString()) {
                active = this.events.events[i];
            }
        }
        for (let i = 0; i < active.eventText.length; i++) {
            if (active.eventText[i][0].toString() === step.toString()) {
                returnStep = active.eventText[i];
            }
        }
        return returnStep;
    }

    getOptions(story: number) {
        let active;
        for (let i = 0; i < this.events.events.length; i++) {
            if (this.events.events[i].id == story) {
                active = this.events.events[i];
            }
        }
        return active.next;
    }

    checkCommand(list) {
        let event: any = null;
        let respObject: any = null;
        let story = 1;
        let step = 0;
        for(let i = 0; i < list.length; i++) {
                switch (list[i]) {
                    case 21:
                        event = this.getEvent(80, 0);
                        respObject = {'story': story, 'step': step, 'type': event[1], 'content': event[2], 'pause': event[3], 'ends': event[4]};
                        break;
                    default:
                        event = this.getEvent(1, 0);
                        respObject = {'story': story, 'step': step, 'type': event[1], 'content': event[2], 'pause': event[3], 'ends': event[4]};
                        break;
                }
         }
        return respObject;
    }

    generateRandomNumber(min, max) {
        // @ts-ignore
        const rand = Math.floor(Math.random() * (max) + min);
        return rand;
    }
}
