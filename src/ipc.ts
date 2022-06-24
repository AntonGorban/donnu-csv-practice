import { BrowserWindow, dialog, IpcMain } from 'electron';
import * as fse from 'fs-extra';
import * as path from 'path';

export const useIpc = (ipcMain: IpcMain, mainWindow: BrowserWindow) => {
  /* -------------------------------------------------------------------------- */
  /*                                READ CSV FILE                               */
  /* -------------------------------------------------------------------------- */

  ipcMain.on('read-csv-file', async (event, _args) => {
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

  /* -------------------------------------------------------------------------- */
  /*                               WRITE CSV FILE                               */
  /* -------------------------------------------------------------------------- */

  ipcMain.on(
    'write-csv-file',
    async (event, args: { path: string; filename: string; data: string }) => {
      await fse
        .outputFile(path.join(args.path, args.filename), args.data)
        .then(() => {
          event.returnValue = true;
        })
        .catch(() => {
          event.returnValue = new Error('не удалось записать файл');
        });
    }
  );

  /* -------------------------------------------------------------------------- */
  /*                                SHOW MESSAGE                                */
  /* -------------------------------------------------------------------------- */

  ipcMain.on(
    'show-message',
    async (
      event,
      args: { type?: string; title: string; message: string; detail?: string }
    ) => {
      event.returnValue = await dialog.showMessageBox(mainWindow, {
        type: args.type || 'info',
        title: args.title,
        message: args.message,
        detail: args.detail,
      });
    }
  );

  /* -------------------------------------------------------------------------- */
  /*                                SAVE CSV FILE                               */
  /* -------------------------------------------------------------------------- */

  ipcMain.on(
    'save-csv-file',
    async (
      event,
      args: { title?: string; defaultPath?: string; data: string }
    ) => {
      await dialog
        .showSaveDialog(mainWindow, {
          title: args.title || 'Сохранение CSV файла',
          defaultPath: args.defaultPath,
          filters: [{ name: 'CSV files', extensions: ['csv'] }],
        })
        .then((filePath) => filePath.filePath)
        .then(async (pathToFile) => {
          if (!pathToFile) {
            event.returnValue = new Error('Файл не выбран');
          } else {
            await fse
              .ensureDir(path.dirname(pathToFile))
              .then(async () => {
                await fse.outputFile(pathToFile, args.data);
                event.returnValue = true;
              })
              .catch(() => {
                event.returnValue = new Error('Нет такой директории');
              });
          }
        });
    }
  );
};
