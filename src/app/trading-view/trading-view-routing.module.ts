import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradingViewComponent } from './trading-view.component';


const routes: Routes = [
  {path: '', component: TradingViewComponent},

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TradingViewRoutingModule { }
