import { BrowserWindow, dialog, IpcMain } from 'electron';
import * as fse from 'fs-extra';
import * as path from 'path';

export const useIpc = (ipcMain: IpcMain, mainWindow: BrowserWindow) => {
  /* -------------------------------------------------------------------------- */
  /*                                READ CSV FILE                               */
  /* -------------------------------------------------------------------------- */

  ipcMain.on('read-csv-file', async (event, _arg) => {
    await dialog
      /**
       * @description просим выбрать CSV файл
       */
      .showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'CSV files', extensions: ['csv'] }],
      })
      /**
       * @description берем путь к файлу
       */
      .then((filePath) => filePath.filePaths[0])
      .then(async (pathToFile) => {
        /**
         * @description проверяем, выбран ли путь к файлу
         */
        if (!pathToFile) {
          event.returnValue = new Error('Файл не выбран');
        } else {
          await fse
            /**
             *@description проверяем существует ли файл
             */
            .ensureFile(pathToFile)
            .then(async () => {
              const fileName = path.basename(pathToFile);
              const dirName = path.dirname(pathToFile);
              /**
               * @description читаем и отдаем файл
               */
              const data = await fse.readFile(pathToFile);
              event.returnValue = {
                dirName,
                fileName,
                pathToFile,
                data: data.toString(),
              };
            })
            .catch(() => {
              event.returnValue = new Error('Нет такого файла');
            });
        }
      });
  });
};
