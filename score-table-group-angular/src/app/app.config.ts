import {ApplicationConfig, importProvidersFrom} from "@angular/core";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {provideRouter} from "@angular/router";

import {routes} from "./app.routes";

const config = import.meta.env.NG_APP_FIREBASE_CONFIG;

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom([
    provideFirebaseApp(() => initializeApp(JSON.parse(config))),
    provideFirestore(() => getFirestore()),
  ])]
};
console.log("test1");
console.log(config);
