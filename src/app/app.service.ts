import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
    private textSource = new BehaviorSubject<string>('Natasha');
    private bdate = new Subject<any>();

    sendBdate(date: any) {
        console.log('Date', date);
        this.bdate.next(date);
    }


    sendText(text: string) {
        console.log(text);
        this.textSource.next(text);
    }

    getText(): Observable<any> {
        return this.textSource.asObservable();
    }

    getBdate(): Observable<any> {
        return this.bdate.asObservable();
    }


}
