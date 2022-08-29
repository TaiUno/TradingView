import { Injectable } from '@angular/core';

const INTERVALS = 'INTERVALS';
const INTERVAL_ID = 'INTERVAL_ID';

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService {
  constructor() {}

  // Load and Save setting list intervals
  public saveSettingIntervalLocal(intervals: string) {
    window.localStorage.removeItem(INTERVALS);
    window.localStorage.setItem(INTERVALS, intervals);
  }

  public getSettingIntervalLocal() {
    if (localStorage.getItem(INTERVALS) !== null) {
      return localStorage.getItem(INTERVALS);
    } else {
      return sessionStorage.getItem(INTERVALS);
    }
  }

  // Load and save state interval
  public saveStateIntervalLocal(interval: string) {
    window.localStorage.removeItem(INTERVAL_ID);
    window.localStorage.setItem(INTERVAL_ID, interval);
  }

  public getStateIntervalLocal() {
    if (localStorage.getItem(INTERVAL_ID) !== null) {
      return localStorage.getItem(INTERVAL_ID);
    } else {
      return sessionStorage.getItem(INTERVAL_ID);
    }
  }
}
