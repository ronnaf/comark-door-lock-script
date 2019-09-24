# serial listener
> This serves as a bridge between the arduino app and the door lock admin server

### Getting started

Make sure you have [NodeJS](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) installed, and the arduino device connected.

Clone app:
```
git clone https://github.com/ronnamaeffirmo/comark-door-lock-script.git
cd comark-door-lock-script
yarn install
```

Run:

Make sure to configure the right `arduinoPort` first before running.  
Go to `comark-door-lock-script/serial-listener.js` and modify the variable `arduinoPort`.
```
node serial-listener.js
```

