import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent implements OnInit {

  @Input() expanded: boolean = false;
  @Input() disabled: boolean = false; // todo:: implement, not implemented yet
  @Output() private clicked = new EventEmitter<MouseEvent>();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(event: MouseEvent) {
    this.clicked.emit(event);
  }

}
