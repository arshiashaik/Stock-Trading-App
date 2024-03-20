import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class InteractionService {
  private _tickerinput = new Subject<string>();
  tickerinput$ = this._tickerinput.asObservable();

  constructor() {}

  sendMessage(message: string) {
    this._tickerinput.next(message);
  }
}
