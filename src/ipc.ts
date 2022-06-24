import { BrowserWindow, dialog, IpcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export const useIpc = (ipcMain: IpcMain, mainWindow: BrowserWindow) => {
  /* -------------------------------------------------------------------------- */
  /*                                READ CSV FILE                               */
  /* -------------------------------------------------------------------------- */

  ipcMain.on('read-csv-file', async (event, _args) => {
    await dialog
      .showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'CSV files', extensions: ['csv'] }],
      })
      .then((filePath) => filePath.filePaths[0])
      .then(async (pathToFile) => {
        if (!pathToFile) event.returnValue = new Error('Файл не выбран');
        else
          fs.readFile(pathToFile, (error, data) => {
            event.returnValue = !!error
              ? error
              : {
                  dirName: path.dirname(pathToFile),
                  fileName: path.basename(pathToFile),
                  data: data.toString(),
                  pathToFile,
                };
          });
      });
  });

  /* -------------------------------------------------------------------------- */
  /*                               WRITE CSV FILE                               */
  /* -------------------------------------------------------------------------- */

  ipcMain.on(
    'write-csv-file',
    (event, args: { path: string; filename: string; data: string }) => {
      fs.writeFile(path.join(args.path, args.filename), args.data, (error) => {
        event.returnValue = !!error ? error : true;
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
          if (!pathToFile) event.returnValue = new Error('Файл не выбран');
          else
            fs.writeFile(pathToFile, args.data, (error) => {
              event.returnValue = !!error ? error : true;
            });
        });
    }
  );
};
