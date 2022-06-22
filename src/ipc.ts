import { BrowserWindow, dialog, IpcMain } from 'electron';
import * as path from 'path';
import * as fse from 'fs-extra';

export const useIpc = (ipcMain: IpcMain, mainWindow: BrowserWindow) => {
  ipcMain.on('getSomething', function (event, arg) {
    event.returnValue = 'something';
  });

  ipcMain.on('select-dirs', async (event, arg) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'CSV files', extensions: ['csv'] }],
    });
    console.log('directories selected', result.filePaths);
    event.returnValue = result;
  });

  ipcMain.on('read-csv-file', async (event, _arg) => {
    await dialog
      /** @description просим выбрать CSV файл */
      .showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'CSV files', extensions: ['csv'] }],
      })
      /** @description берем путь к файлу */
      .then((filePath) => filePath.filePaths[0])
      .then(async (pathToFile) => {
        /** @description проверяем, выбран ли путь к файлу */
        if (!pathToFile) {
          event.returnValue = new Error('Файл не выбран');
        } else {
          await fse
            /** @description проверяем существует ли файл */
            .ensureFile(pathToFile)
            .then(async () => {
              /** @description читаем и отдаем файл */
              const data = await fse.readFile(pathToFile);
              event.returnValue = data.toString();
            })
            .catch(() => {
              event.returnValue = new Error('Нет такого файла');
            });
        }
      });
  });
};
