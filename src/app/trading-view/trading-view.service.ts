import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

interface Binanace {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

@Injectable({
  providedIn: 'root',
})
export class TradingViewService {
  constructor(private http: HttpClient) {}

  getBinance(time: string) {
    // to build server remove 'api' character.
    return this.http.get(`/getBinance/${time}`).pipe(
      map((response: any) => {
        const chartData = response.map((data) => {
          return {
            time: data.closeTime / 1000,
            open: parseFloat(data.open),
            high: parseFloat(data.high),
            low: parseFloat(data.low),
            close: parseFloat(data.close),
          } as Binanace;
        });

        return chartData;
      })
    );
  }
}
