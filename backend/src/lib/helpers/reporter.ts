import { SpecReporter } from 'jasmine-spec-reporter';
import dotenv from 'dotenv';
dotenv.config();
process.env.ENV = 'test';

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new SpecReporter({
    suite: {
      displayNumber: true
    },
    spec: {
      displayPending: false,
      displayDuration: false,
      displayErrorMessages: true
    },
    summary: {
      displayDuration: true,
      displayFailed: true,
      displaySuccessful: false,
      displayPending: true,
      displayErrorMessages: false
    }
  })
);
