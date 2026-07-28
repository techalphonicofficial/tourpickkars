const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
  host: '76.13.242.12',
  port: 22,
  username: 'root',
  password: 'Tourpickkars@2026'
};

const localFile = path.join(__dirname, 'release.tar.gz');
const remoteFile = '/home/tourpickkars.in/public_html/release.tar.gz';

const conn = new Client();

conn.on('ready', () => {
    console.log('SFTP connecting...');
    conn.sftp((err, sftp) => {
        if (err) {
            console.error('SFTP error:', err);
            conn.end();
            return;
        }

        console.log(`Uploading ${localFile} to ${remoteFile}...`);
        sftp.fastPut(localFile, remoteFile, (err) => {
            if (err) {
                console.error('Upload failed:', err);
            } else {
                console.log('Upload successful!');
            }
            conn.end();
        });
    });
}).on('error', (err) => {
    console.error('Connection error:', err);
}).connect(config);
