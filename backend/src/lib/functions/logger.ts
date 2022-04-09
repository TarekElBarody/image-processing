import fs from 'fs';
import microtime from 'microtime';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const noConsole = Number(process.env.NO_CONSOLE);

export default class logger {
  //set private variables
  private errorMessage: string;
  private isDev: boolean;
  private logFile: string;
  private logDir: string;
  private timeStart: number;
  private timeEnd: number;
  private timeDuration: string;

  // construct new logger with file log name
  constructor(log: string) {
    this.errorMessage = '';
    // check if node in development
    this.isDev = (process.env.NODE_ENV || 'dev') == 'dev' ? true : false;
    this.logFile = log + '.log';
    this.logDir = path.resolve('./logs');
    this.timeStart = 0;
    this.timeEnd = 0;
    this.timeDuration = '';
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir); // create the log file with name given
    }
  }

  // start the microtime to log duration before log
  start(): void {
    this.timeStart = microtime.now();
  }

  // end the microtime to calculate duration before log
  end(): void {
    if (this.timeStart > 0) {
      this.timeEnd = microtime.now();
      const dr = (this.timeEnd - this.timeStart) / 1000;
      this.timeDuration = 'Process Duration : ' + dr + 'ms';
    }
  }

  // append  the log message to the file log
  saveToFile(): void {
    const date = new Date().toString().split('GMT')[0];
    fs.writeFileSync(
      path.join(this.logDir, this.logFile),
      this.errorMessage + '\n' + date + ' ' + this.timeDuration + '\n',
      {
        flag: 'a+'
      }
    );
  }

  // log without time the message (msg)
  log(msg: string): void {
    this.errorMessage = msg;
    this.saveToFile();
    if (this.isDev && noConsole != 1) {
      console.log(this.errorMessage);
    }
  }

  // log with time the message (msg)
  logT(msg: string): void {
    this.errorMessage = msg;
    this.saveToFile();
    if (this.isDev && noConsole != 1) {
      console.log(this.errorMessage);
      console.log(this.timeDuration);
    }
  }
}
