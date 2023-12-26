import { Component, OnInit } from '@angular/core';
import { AlfabetService } from '../alfabet.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-llista-alfabet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './llista-alfabet.component.html',
  styleUrl: './llista-alfabet.component.scss'
})
export class LlistaAlfabetComponent {
  alphabet: string[] = [];

  constructor(private alfabetService: AlfabetService) {}

  ngOnInit(): void {
    this.alphabet = this.alfabetService.getAlfabet();
  }
  
}
