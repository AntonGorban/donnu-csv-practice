import { CSVDataType } from '../../types/domain';
import { Country } from './Country';
import { Products } from './Products';
import { StatItem } from './StatItem';
import { StatList } from './StatList';

export class StatsManager {
  private readonly _defaultData = defaultData;
  private readonly _clearData = clearData;

  private readonly _prepareDataItem = (dataItem: CSVDataType[0]): StatItem => {
    return new StatItem(
      new Country(dataItem[0], dataItem[1]),
      new Products(dataItem[2], dataItem[3], dataItem[4])
    );
  };

  private readonly _prepareCSVDataItem = (
    dataItem: StatItem
  ): CSVDataType[0] => {
    return [
      dataItem.country.region,
      dataItem.country.country,
      dataItem.products.steel,
      dataItem.products.coal,
      dataItem.products.oil,
    ];
  };

  private readonly _prepareData = (data: CSVDataType): Array<StatItem> => {
    return data.map((statItem) => this._prepareDataItem(statItem));
  };

  private readonly _prepareCSCData = (data: Array<StatItem>): CSVDataType => {
    return data.map((statItem) => this._prepareCSVDataItem(statItem));
  };

  public readonly getDefaultData = () => {
    return this._prepareData(this._defaultData);
  };

  public readonly generateData = (data: CSVDataType) => {
    return new StatList(this._prepareData(data));
  };

  public readonly generateCSVData = (data: Array<StatItem>): CSVDataType => {
    return this._prepareCSCData(data);
  };

  public readonly generateDefaultData = () => {
    return new StatList(this._prepareData(this._defaultData));
  };

  public readonly getClearData = () => {
    return this._prepareData(this._clearData);
  };

  public readonly getClearDataItem = () => {
    return this._prepareDataItem(this._clearData[0]);
  };
}

const clearData: CSVDataType = [['', '', 0, 0, 0]];

const defaultData: CSVDataType = [
  ['Северная Америка', 'США', 78.6, 660.6, 11.8],
  ['Азия', 'Индия', 95.6, 692.4, 4.0],
  ['Европа, Азия', 'Россия', 70.8, 227.2, 13.9],
  ['Европа', 'Франция', 14.1, 5.3, 0.4],
  ['Азия', 'Южная Корея', 68.6, 1.15, 1.2],
  ['Азия', 'Турция', 33.2, 70.6, 2.5],
  ['Азия', 'Япония', 104.8, 5.8, 1.22],
];
