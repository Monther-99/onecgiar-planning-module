import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CenterStatusService {
  public validPartner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
}
