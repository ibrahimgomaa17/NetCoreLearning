import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  constructor() { }
  @Input() title:String|any;
  @Input() active:boolean|any;
  ngOnInit(): void {
  }

}
