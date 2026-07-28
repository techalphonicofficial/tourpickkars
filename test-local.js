const { Client } = require('ssh2');

const config = {
  host: '76.13.242.12',
  port: 22,
  username: 'root',
  password: 'Tourpickkars@2026'
};

const conn = new Client();

conn.on('ready', () => {
  // console.log('Testing local response on port 3000...\n');
  conn.exec('curl -I http://localhost:3000', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      conn.end();
    }).on('data', (data) => {
      process.stdout.write(data);
    }).stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}).connect(config);
