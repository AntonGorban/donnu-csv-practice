import { StatItem } from './StatItem';

export class StatList {
  constructor(private _stats: Array<StatItem>) {}

  get stats() {
    return this._stats;
  }

  setStats = (stats: Array<StatItem>) => {
    this._stats = stats;
  };

  push = (item: StatItem) => {
    this._stats.push(item);
  };

  delete = (idx: number) => {
    this._stats.splice(idx, 1);
  };
}
