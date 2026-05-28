import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

registerLocaleData(localeRo);