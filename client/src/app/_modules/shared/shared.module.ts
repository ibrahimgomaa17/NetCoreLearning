import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tab/tab.component';
import { FileUploadModule } from 'ng2-file-upload';



@NgModule({
  declarations: [
    TabsComponent,
    TabComponent
  ],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      positionClass:'toast-bottom-right'
    }),
    FileUploadModule
  ],
  exports:[
    ToastrModule,
    TabsComponent,  
    TabComponent,
    FileUploadModule
  ]
})
export class SharedModule { }
