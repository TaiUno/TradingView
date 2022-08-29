import { Component, OnInit, ViewChild } from '@angular/core';
import { TradingViewService } from './trading-view.service';
import { createChart } from 'lightweight-charts';
import { LocalStoreService } from '../service/localStore.service';

@Component({
  selector: 'app-trading-view',
  templateUrl: './trading-view.component.html',
  styleUrls: ['./trading-view.component.scss'],
})
export class TradingViewComponent implements OnInit {
  chart: any;
  candlestickSeries: any;
  isEditButton: boolean = true;
  intervalSelected: string = '1D';
  intervalListLocalToSave: string[] = [];
  intervalListLocalToLoaded: string[] = ['1m', '3m', '1H', '1D'];
  classActive: string = 'active';
  classChecked: string = 'checked';
  gridColor: string = '#212530';
  timeScaleColor: string = '#D1D4DC';
  intervalItemsOriginal: string[] = [
    '1m',
    '3m',
    '5m',
    '15m',
    '30m',
    '1H',
    '2H',
    '4H',
    '6H',
    '8H',
    '12H',
    '1D',
    '3D',
    '1W',
    '1M',
  ];

  @ViewChild('container') containerRef;

  constructor(
    private tradingViewService: TradingViewService,
    private localStoreService: LocalStoreService
  ) {}

  ngOnInit(): void {
    // Load interval
    this.intervalListLocalToLoaded =
      this.loadStateIntervals().length > 0
        ? this.loadStateIntervals()
        : this.intervalListLocalToLoaded;
    this.intervalSelected =
      this.intervalListLocalToLoaded[0] || this.intervalSelected;
  }

  ngAfterViewInit(): void {
    // Create chart
    this.setup(this.containerRef.nativeElement);
    this.autoRefreshChartData();

    //Load state interval toolbar
    const intervalState = this.localStoreService.getStateIntervalLocal();
    document
      .getElementById(`${intervalState || this.intervalSelected}_headerId`)
      ?.classList.add(this.classActive);

    // Resize chart
    new ResizeObserver((entries) => {
      if (
        entries.length === 0 ||
        entries[0].target !== this.containerRef.nativeElement
      ) {
        return;
      }
      const newRect = entries[0].contentRect;

      this.chart.applyOptions({ height: newRect.height, width: newRect.width });
    }).observe(this.containerRef.nativeElement);
  }

  refreshChart(interval): void {
    this.updateChart(interval);
  }

  setup(containerElm): void {
    this.chart = createChart(containerElm, {
      width: 700,
      height: 500,
      timeScale: {
        timeVisible: true,
        borderColor: this.timeScaleColor,
      },
      rightPriceScale: {
        borderColor: this.timeScaleColor,
      },
      layout: {
        backgroundColor: '#171b26',
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        horzLines: {
          color: this.gridColor,
        },
        vertLines: {
          color: this.gridColor,
        },
      },
    });

    this.candlestickSeries = this.chart.addCandlestickSeries({
      upColor: 'rgb(38,166,154)',
      downColor: 'rgb(255,82,82)',
      wickUpColor: 'rgb(38,166,154)',
      wickDownColor: 'rgb(255,82,82)',
      borderVisible: false,
    });
  }

  updateInterval(e: any): void {
    Array.from(document.querySelectorAll('.item.active')).forEach((el) =>
      el.classList.remove(this.classActive)
    );
    e.target.classList.add(this.classActive);
    this.intervalSelected = e.target.innerText;

    this.localStoreService.saveStateIntervalLocal(e.target.innerText);
    this.autoRefreshChartData();
  }

  showHideStateIntervals(e: any): void {
    this.intervalListLocalToLoaded?.forEach((item: string) => {
      document.getElementById(`${item}_id`)?.classList.add(this.classChecked);
      document.getElementsByTagName('input')[item].checked = true;
    });

    e.target.classList.toggle('arrow_up');
    e.target.classList.toggle(this.classActive);
  }

  onChangeCheckBox(e: any): void {
    document
      .getElementById(`${e.target.id}_id`)
      ?.classList.toggle(this.classChecked);

    if (
      !this.intervalListLocalToSave.includes(e.target.id) &&
      document.getElementsByTagName('input')[e.target.id].checked
    ) {
      this.intervalListLocalToLoaded.push(e.target.id);
    } else {
      this.intervalListLocalToLoaded = this.intervalListLocalToLoaded.filter(
        (item) => item !== e.target.id
      );
    }

    this.intervalListLocalToSave = this.intervalListLocalToLoaded;
    this.isEditButton = false;
  }

  // Save state interval at local storage
  saveStateInterval(): void {
    if (this.isEditButton) return;

    this.localStoreService.saveSettingIntervalLocal(
      this.intervalListLocalToSave.join()
    );
    document
      .getElementsByClassName('arrow_down')[0]
      ?.classList.remove(this.classActive);
    document
      .getElementsByClassName('arrow_up')[0]
      ?.classList.toggle('arrow_up');

    this.isEditButton = true;
  }

  // Load state interval at local storage
  loadStateIntervals(): string[] {
    const interval = this.localStoreService.getSettingIntervalLocal();

    return interval ? interval.split(',') : [];
  }

  private autoRefreshChartData(): void {
    let isFristTimeLoad: boolean = true;
    const interval: string = this.intervalSelected;

    if (isFristTimeLoad) {
      this.updateChart(interval);
      isFristTimeLoad = false;
    } else {
      this.refreshChart(interval);
    }
  }

  private updateChart(interval): void {
    this.tradingViewService.getBinance(interval).subscribe((chartData) => {
      this.candlestickSeries.setData(chartData);
    });
  }
}
