import { Component, ContentChild, ContentChildren, Input, OnInit, QueryList, TemplateRef } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  constructor() { }
  titles:any = [];
  @ContentChild(TemplateRef) button! : TemplateRef<any>;
  @ContentChildren(TabComponent)
  tabs!: QueryList<TabComponent>;
  ngOnInit(): void {

  }
  ngAfterContentInit() {
    console.log(this);
    this.titles = this.tabs?.map(x => x.title);

  }
  indexClick(num:number){
    this.tabs?.forEach(x=> x.active = false);
    this.tabs.toArray()[num].active = true;
  }
}
