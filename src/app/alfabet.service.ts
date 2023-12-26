import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlfabetService {
  getAlfabet(): string[] {
    return 'ABCÇDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  }
}
