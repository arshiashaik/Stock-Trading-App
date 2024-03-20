import { Component, OnInit } from '@angular/core';
import { InteractionService } from '../interaction.service';
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent implements OnInit {
  inputvalue: string;
  constructor(private _interactionService: InteractionService) {}

  ngOnInit(): void {
    this._interactionService.tickerinput$.subscribe((message) => {
      this.inputvalue = message;
    });
  }
}
