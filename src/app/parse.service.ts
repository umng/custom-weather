import {Injectable, Output, EventEmitter} from '@angular/core';
import * as Parse from 'parse';


@Injectable()
export class ParseService {
  Parse;
  IsLoggedIn;

  constructor() {
    this.Parse = Parse;
    this.Parse.initialize('55d6c379-c8c0-4c37-844a-9c33c5484236', 'oNTkB7tj0kBpL1Ebu34AzsEY60jsJG6E');
    this.Parse.serverURL = 'https://api.parse.buddy.com/parse/';
    this.IsLoggedIn = false;
  }

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  loggedIn() {
    this.IsLoggedIn = true;
    this.change.emit(this.IsLoggedIn);
  }

  getLoggedUserIfAny() {
    return Parse.User.current();
  }
}
