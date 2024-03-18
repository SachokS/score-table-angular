import {ApplicationConfig, importProvidersFrom} from "@angular/core";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {provideRouter} from "@angular/router";

import {routes} from "./app.routes";

const firebaseConfig = {
  apiKey: "AIzaSyBEB-8XDdwBJXr5i8BGq3TYfb1p8LkGTHk",
  authDomain: "score-table-2ef3b.firebaseapp.com",
  projectId: "score-table-2ef3b",
  storageBucket: "score-table-2ef3b.appspot.com",
  messagingSenderId: "978527265236",
  appId: "1:978527265236:web:cb10bc887fba7ceb2f3641"
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom([
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ])]
};
