import { ElectronService } from 'ngx-electron';

import { Component } from '@angular/core';

import { StatList } from '../Classes/Domain/StatList';
import { CSVParserService } from './csvparser.service';
import { StatsManagerService } from './StatsManager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected stats: StatList;
  protected fileName: null | string = null;
  protected dirName: null | string = null;
  protected pathToFile: null | string = null;
  protected data: null | string = null;

  constructor(
    private readonly _statsManagerService: StatsManagerService,
    private readonly _electronService: ElectronService,
    private readonly _csvParserService: CSVParserService
  ) {
    this.stats = new StatList(this._statsManagerService.getClearData());
  }

  private readonly _electronIsAvailable = () => {
    return (
      !!this?._electronService?.isElectronApp &&
      !!this?._electronService?.ipcRenderer
    );
  };

  protected readCsv() {
    try {
      if (!this._electronIsAvailable())
        throw new Error('Невозможно выполнение данной функции');

      const response =
        this._electronService.ipcRenderer.sendSync('read-csv-file');

      if (response instanceof Error) throw new Error(response.message);

      this.fileName = response.fileName;
      this.dirName = response.dirName;
      this.pathToFile = response.pathToFile;
      this.data = response.data;

      console.log(this._csvParserService.parseCsv(response.data));
    } catch (error) {
      console.error(error);
    }
  }

  protected readonly setDefaultData = () => {
    this.stats.setStats(this._statsManagerService.getDefaultData());
  };

  protected setRegion = (event: Event, idx: number) => {
    this.stats.stats[idx].country.region = this.getValue(event);
  };

  protected setCountry = (event: Event, idx: number) => {
    this.stats.stats[idx].country.country = this.getValue(event);
  };

  protected setSteel = (event: Event, idx: number) => {
    this.stats.stats[idx].products.steel = Number(this.getValue(event));
  };

  protected setCoal = (event: Event, idx: number) => {
    this.stats.stats[idx].products.coal = Number(this.getValue(event));
  };

  protected setOil = (event: Event, idx: number) => {
    this.stats.stats[idx].products.oil = Number(this.getValue(event));
  };

  private getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected deleteStatItem = (idx: number) => {
    this.stats.delete(idx);
  };

  protected createStatItem = () => {
    this.stats.push(this._statsManagerService.getClearDataItem());
  };
}
