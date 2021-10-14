import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert, AlertType } from '../model/alert.model';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(
    private router : Router, 
    private alertService : AlertService
  ) { }

  ngOnInit(): void {
    // this.alertSubscription = this.alertService.onAlert(this.id)
    //   .subscription(alert => {
    //     if(!alert.message){
    //       this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

    //       this.alerts.forEach(x => delete x.keepAfterRouteChange);
    //       return;
    //     }

    //     this.alerts.push(alert);

    //     if(alert.autoClose){
    //       setTimeout(() => this.removeAlert(alert), 3000)
    //     }
    //   });

    //   this.routeSubscription = this.router.events.subscribe(events => {
    //     if(event instanceof NavigationStart){
    //       this.alertService.clear(this.id);
    //     }
    //   });
  }

  ngOnDestroy(){
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert(alert : Alert){
    if(!this.alerts.includes(alert)) return;

    if(this.fade){
      alert.fade = true;

      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert);
      }, 250);
    }else{
      this.alerts = this.alerts.filter(x => x !== alert);
    }
  }

  cssClasses(alert : Alert){
    if(!alert) return null;

    const classes = ['alert', 'alert-dismissable'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert alert-success',
      [AlertType.Error]: 'alert alert-danger',
      [AlertType.Info]: 'alert alert-info',
      [AlertType.Warning]: 'alert alert-warning'
    }

    classes.push(alertTypeClass[alert.type]);

    if(alert.fade){
      classes.push('fade');
    }

    return classes.join(' ');
  }

}
