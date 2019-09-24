const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/cu.usbmodem141201', {baudRate: 9600});
const parser = port.pipe(new Readline({delimiter: '\n'}));
const fetch = require('node-fetch');

// Read the port data
port.on("open", () => {
    console.log('[!] serial port open');
});

parser.on('data', async data => {
    try {
        if (data.substr(0, 1) === '_') {
            const id = data.substr(4, data.length - 1)
            console.log('[LOG] id -', id)

            const fetched = await fetch(`http://localhost:3030/rfids?rfid=${id}`);
            const rfids = await fetched.json()

            if (rfids.data.length) {
                await fetch("http://localhost:3030/logs", {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        rfid: rfids.data[0].rfid,
                        authorized: true,
                        registeredName: rfids.data[0].owner
                    })
                });

                port.write('K', (err) => {
                    if (err) {
                        return console.log('[!] ERR - Granted -', err.message);
                    }
                    console.log('[LOG] Granted message written!');
                });
            } else {
                await fetch("http://localhost:3030/logs", {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        rfid: id.substr(0, 11),
                        authorized: false
                    })
                });

                port.write('N', (err) => {
                    if (err) {
                        return console.log('[!] ERR - Forbidden -', err.message);
                    }
                    console.log('[LOG] Forbidden message written!');
                });
            }
        }
    } catch (e) {
        console.log('[LOG] ERR -', e.message)
    }
});
