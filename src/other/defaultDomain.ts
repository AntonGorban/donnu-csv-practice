import { Country } from '../Classes/Domain/Country';
import { Products } from '../Classes/Domain/Products';
import { StatItem } from '../Classes/Domain/StatItem';

const generateData = (data: Data): Array<StatItem> =>
  data.map(
    (statItem) =>
      new StatItem(
        new Country(statItem.region, statItem.country),
        new Products(statItem.steel, statItem.coal, statItem.oil)
      )
  );

export const getDefaultData = () => generateData(data);

export const getClearData = () => generateData(clearData);

type Data = ReadonlyArray<{
  region: string;
  country: string;
  steel: number;
  coal: number;
  oil: number;
}>;

const clearData: Data = [
  {
    region: '',
    country: '',
    steel: 0,
    coal: 0,
    oil: 0,
  },
];

const data: Data = [
  {
    region: 'Северная Америка',
    country: 'США',
    steel: 78.6,
    coal: 660.6,
    oil: 11.8,
  },
  {
    region: 'Азия',
    country: 'Индия',
    steel: 95.6,
    coal: 692.4,
    oil: 4.0,
  },
  {
    region: 'Европа, Азия',
    country: 'Россия',
    steel: 70.8,
    coal: 227.2,
    oil: 13.9,
  },
  {
    region: 'Европа',
    country: 'Франция',
    steel: 14.1,
    coal: 5.3,
    oil: 0.4,
  },
  {
    region: 'Азия',
    country: 'Южная Корея',
    steel: 68.6,
    coal: 1.15,
    oil: 1.2,
  },
  {
    region: 'Азия',
    country: 'Турция',
    steel: 33.2,
    coal: 70.6,
    oil: 2.5,
  },
  {
    region: 'Азия',
    country: 'Япония',
    steel: 104.8,
    coal: 5.8,
    oil: 1.22,
  },
];
