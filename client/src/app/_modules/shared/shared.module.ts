import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tab/tab.component';



@NgModule({
  declarations: [
    TabsComponent,
    TabComponent
  ],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      positionClass:'toast-bottom-right'
    })
  ],
  exports:[
    ToastrModule,
    TabsComponent,
    TabComponent
  ]
})
export class SharedModule { }
