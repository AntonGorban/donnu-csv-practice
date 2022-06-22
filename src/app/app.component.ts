import { Component } from '@angular/core';

import { StatList } from '../Classes/Domain/StatList';
import { getClearData, getDefaultData } from '../other/defaultDomain';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected stats: StatList = new StatList(getClearData());

  protected readonly setDefaultData = () => {
    this.stats.setStats(getDefaultData());
  };
}
