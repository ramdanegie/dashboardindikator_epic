import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from 'primeng/primeng';
import { AlertMsg } from './alert.interface';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';

@Component({
    selector: 'app-alert',
    template: '<p-growl [value]="msgs"></p-growl>'
})

export class AlertComp implements OnInit, OnDestroy {
	message: AlertMsg;
	msgs: Message[] = [];
    private showS: Subscription;

    constructor(private alertService: AlertService) { }
 
    ngOnInit() {
        this.showS = this.alertService.getMessage().subscribe(message => { this.showAlert(message); });
        console.log('ngOnInit alert');
    }

    ngOnDestroy() {
        this.showS.unsubscribe();
    }

    showAlert(message){
    	this.msgs = [];
        this.msgs.push({severity: message.info, summary:message.summary, detail:message.detail});
    }
}