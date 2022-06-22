import { ElectronService } from 'ngx-electron';

import { Component } from '@angular/core';

import { StatList } from '../Classes/Domain/StatList';
import {
  getClearData,
  getClearDataItem,
  getDefaultData,
} from '../other/defaultDomain';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected stats: StatList = new StatList(getClearData());

  constructor(private readonly _electronService: ElectronService) {}

  protected testIPC() {
    console.log(this._electronService);
    if (this._electronService.isElectronApp) {
      const response =
        this._electronService.ipcRenderer.sendSync('getSomething');
      console.log(response); // prints 'something'
    }
  }

  protected testDir() {
    if (this._electronService.isElectronApp) {
      const response =
        this._electronService.ipcRenderer.sendSync('select-dirs');
      console.log(response); // prints 'something'
    }
  }

  protected readCsv() {
    if (this._electronService.isElectronApp) {
      const response =
        this._electronService.ipcRenderer.sendSync('read-csv-file');
      console.log(response);
    }
  }

  protected readonly setDefaultData = () => {
    this.stats.setStats(getDefaultData());
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
    this.stats.push(getClearDataItem());
  };
}
