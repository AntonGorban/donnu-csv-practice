import { ElectronService } from 'ngx-electron';

import { Component } from '@angular/core';

import { StatList } from '../Classes/Domain/StatList';
import { ValidationError } from '../Classes/Error/ValidationError';
import { Validator } from '../Classes/Validation/Validator';
import { csvDataVS } from '../other/validation/csvDataVS';
import { CSVDataType, ViewType } from '../types/domain';
import { CSVParserService } from './csvparser.service';
import { StatsManagerService } from './StatsManager.service';
import { ValidationService } from './validation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected stats: StatList;

  protected preparedStats: null | CSVDataType = null;
  protected viewType: ViewType = 'raw';

  protected fileName: null | string = null;
  protected dirName: null | string = null;
  protected pathToFile: null | string = null;

  private readonly _csvValidator: Validator<CSVDataType>;

  constructor(
    private readonly _statsManagerService: StatsManagerService,
    private readonly _electronService: ElectronService,
    private readonly _csvParserService: CSVParserService,
    private readonly _validateService: ValidationService
  ) {
    this.stats = this._statsManagerService.generateDefaultData();
    this._csvValidator = this._validateService.generateValidator(
      csvDataVS,
      'csv-file'
    );
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

      this._electronService.ipcRenderer.sendSync('show-message', {
        title: 'Чтение CSV файла',
        message: 'CSV файл успешно прочитан',
      });

      this.fileName = response.fileName;
      this.dirName = response.dirName;
      this.pathToFile = response.pathToFile;

      const parsedData = this._csvParserService.parseCsv(response.data);

      const data = this._csvValidator.validate(parsedData);

      this._electronService.ipcRenderer.sendSync('show-message', {
        title: 'Валидация CSV файла',
        message: 'CSV файл успешно прошел валидацию',
      });

      this.stats = this._statsManagerService.generateData(data);
    } catch (error) {
      this._catchErrorHandler(error);
    }
  }

  protected readonly writeCsv = () => {
    try {
      if (!this._electronIsAvailable())
        throw new Error('Невозможно выполнение данной функции');

      const data = this._csvParserService.toCsv(
        this._statsManagerService.generateCSVData(this.stats.stats)
      );

      const response = this._electronService.ipcRenderer.sendSync(
        'write-csv-file',
        { path: this.dirName, filename: this.fileName, data }
      );

      if (response instanceof Error) throw new Error(response.message);

      this._electronService.ipcRenderer.sendSync('show-message', {
        title: 'Запись CSV файла',
        message: 'CSV файл успешно перезаписан',
      });
    } catch (error) {
      this._catchErrorHandler(error);
    }
  };

  protected readonly savePreparedCsv = () => {
    try {
      if (!this._electronIsAvailable())
        throw new Error('Невозможно выполнение данной функции');

      const data = this._csvParserService.toCsv(this.preparedStats || []);

      const defaultPath =
        !!this.dirName && !!this.fileName
          ? `${this.dirName}/${this.viewType}-${this.fileName}`
          : `${this.viewType}.csv`;

      const response = this._electronService.ipcRenderer.sendSync(
        'save-csv-file',
        {
          title: 'Сохранить информацию сводного характера',
          defaultPath,
          data,
        }
      );

      if (response instanceof Error) throw new Error(response.message);

      this._electronService.ipcRenderer.sendSync('show-message', {
        title: 'Запись CSV файла',
        message:
          'Сохранение информацию сводного характера в CSV файле прошло успешно',
      });
    } catch (error) {
      this._catchErrorHandler(error);
    }
  };

  private readonly _catchErrorHandler = (error: unknown) => {
    if (error instanceof ValidationError) {
      const errorMessage = this._validateService.getErrorMessage(
        error.info,
        error.dataVar
      );

      this._electronService.ipcRenderer.sendSync('show-message', {
        type: 'error',
        title: 'Ошибка валидации',
        message: errorMessage,
      });
    } else if (error instanceof Error) {
      this._electronService.ipcRenderer.sendSync('show-message', {
        type: 'error',
        title: 'Ошибка',
        message: error.message,
        detail: JSON.stringify(error),
      });
    } else {
      this._electronService.ipcRenderer.sendSync('show-message', {
        type: 'error',
        title: 'Непредвиденная ошибка',
        message: 'Что-то пошло не так',
        detail: JSON.stringify(error),
      });
      throw new Error('WTF');
    }
  };

  protected readonly setDefaultData = () => {
    this.stats.setStats(this._statsManagerService.getDefaultData());
  };

  protected readonly setRegion = (event: Event, idx: number) => {
    this.stats.stats[idx].country.region = this.getValue(event);
  };

  protected readonly setCountry = (event: Event, idx: number) => {
    this.stats.stats[idx].country.country = this.getValue(event);
  };

  protected readonly setSteel = (event: Event, idx: number) => {
    this.stats.stats[idx].products.steel = Number(this.getValue(event));
  };

  protected readonly setCoal = (event: Event, idx: number) => {
    this.stats.stats[idx].products.coal = Number(this.getValue(event));
  };

  protected readonly setOil = (event: Event, idx: number) => {
    this.stats.stats[idx].products.oil = Number(this.getValue(event));
  };

  private getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected readonly deleteStatItem = (idx: number) => {
    this.stats.delete(idx);
  };

  protected readonly createStatItem = () => {
    this.stats.push(this._statsManagerService.getClearDataItem());
  };

  protected readonly changeViewType = (viewType: ViewType) => {
    try {
      this.viewType = viewType;

      switch (viewType) {
        case 'raw':
          this.preparedStats = null;
          break;

        case 'find':
          this.preparedStats = this._statsManagerService.prepareFind(
            this.stats.stats
          );
          break;

        case 'filter1':
          this.preparedStats = this._statsManagerService.prepareFilter1(
            this.stats.stats
          );
          break;

        case 'filter2':
          this.preparedStats = this._statsManagerService.prepareFilter2(
            this.stats.stats
          );
          break;

        default:
          throw new Error('Не валидный тип отображения');
      }
    } catch (error) {
      this._catchErrorHandler(error);
    }
  };
}
