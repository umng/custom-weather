import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  @Output()
  private _change: EventEmitter<string> = new EventEmitter();
  public get change(): EventEmitter<string> {
    return this._change;
  }
  public set change(value: EventEmitter<string>) {
    this._change = value;
  }

  constructor() { }

  loadRecords(className: string) {
    this.change.emit(className);
  }
}
