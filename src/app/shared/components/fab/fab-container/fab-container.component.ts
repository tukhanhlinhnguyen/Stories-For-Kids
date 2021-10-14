import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fab-container',
  templateUrl: './fab-container.component.html',
  styleUrls: ['./fab-container.component.scss']
})
export class FabContainerComponent implements OnInit {

  @Input() direction: 'row' | 'col' = 'col';

  constructor() { }

  ngOnInit(): void {
  }

}
