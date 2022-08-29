import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingViewComponent } from './trading-view.component';
import { TradingViewRoutingModule } from './trading-view-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TradingViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TradingViewRoutingModule
  ]
})
export class TradingViewModule { }
