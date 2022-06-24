import * as papaparse from 'papaparse';

import { Injectable } from '@angular/core';

import { ExceptionError } from '../Classes/Error/ExceptionError';
import { CSVDataType } from '../types/domain';

@Injectable({
  providedIn: 'root',
})
export class CSVParserService {
  public parseCsv = (str: string) => {
    const data = papaparse.parse(str).data;

    if (!data.every((dataItem) => Array.isArray(dataItem)))
      throw new ExceptionError('не валидный CSV');

    if ((data as Array<Array<unknown>>)[data.length - 1].length <= 1)
      data.pop();

    return data;
  };

  public toCsv = (csvData: CSVDataType) => {
    return papaparse.unparse(
      csvData as unknown as Array<Array<string | number>>
    );
  };
}
