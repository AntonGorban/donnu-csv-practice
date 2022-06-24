import { Injectable } from '@angular/core';

import { StatsManager } from '../Classes/Domain/StatsManager';

@Injectable({
  providedIn: 'root',
})
export class StatsManagerService extends StatsManager {}
