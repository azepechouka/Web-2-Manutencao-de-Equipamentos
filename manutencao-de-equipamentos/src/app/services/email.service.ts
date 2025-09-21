import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EmailService {
  send(to: string, subject: string, body: string): Observable<void> {
    // TODO: integrar com seu provedor de e-mail (SendGrid, SES, etc.)
    console.info('[EmailService] Enviando e-mail para:', to, '\nAssunto:', subject, '\nBody:\n', body);
    return of(void 0).pipe(delay(250));
  }
}
