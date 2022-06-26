# donnu-csv-practice

> This projects created for `DonNU`

## Development

You mast start command `npm run start`

Or:

- `npm run watch:electron` - start tsc watching for electron files
- `npm run start:web` - start `Angular` web server
- `npm run electron` - start `Electron` wrapper

### Development error

[Namespace 'Electron.CrossProcessExports' has no exported member 'Remote'](https://github.com/ThorstenHans/ngx-electron/issues/71)

## Build

You must start command:

- `npm run package:win` - start building package for `Windows` OS
- `npm run package:linux` - start building package for `Linux` OS
- `npm run package:linux:x64` - start building package for `linux` OS with arch `x64`
- `npm run package:linux:armv7l` - start building package for `linux` OS with arch `armv7l`
- `npm run package:linux:arm64` - start building package for `linux` OS with arch `arm64`
- `npm run package:osx` - start building package for `macOS`
- `npm run package:all` - start building package for all OS's

## Release

[Current Release](https://github.com/AntonGorban/donnu-csv-practice/releases/latest)

Packages:

- `Windows`:
  - [x64](https://github.com/AntonGorban/donnu-csv-practice/releases/download/1.0.0/donnu-csv-practice-1.0.0-win32-x64.zip)
  - [arm64](https://github.com/AntonGorban/donnu-csv-practice/releases/download/1.0.0/donnu-csv-practice-1.0.0-win32-arm64.zip)
  - [ia32](https://github.com/AntonGorban/donnu-csv-practice/releases/download/1.0.0/donnu-csv-practice-1.0.0-win32-ia32.zip)
- `Linux`:
  - [x64](https://github.com/AntonGorban/donnu-csv-practice/releases/download/1.0.0/donnu-csv-practice-1.0.0-linux-x64.tar.gz)
  - [arm64](https://github.com/AntonGorban/donnu-csv-practice/releases/download/1.0.0/donnu-csv-practice-1.0.0-linux-arm64.tar.gz)
  - [armv7l](https://github.com/AntonGorban/donnu-csv-practice/releases/download/1.0.0/donnu-csv-practice-1.0.0-linux-armv7l.tar.gz)
