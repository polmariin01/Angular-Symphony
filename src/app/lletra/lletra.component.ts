import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LlistaApiService } from '../llista-api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lletra',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lletra.component.html',
  styleUrl: './lletra.component.scss'
})
export class LletraComponent {
  letter: string | null = null;
  data: any;

  constructor(private route : ActivatedRoute, private apiService: LlistaApiService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.letter = params.get('id');
      console.log('Letter: ', this.letter)
      this.getData();
    })
  }

  getData(): void {
    this.apiService.getData(this.letter).subscribe(
      (response) => {
        this.data = response;
        console.log(this.data);
      });
  }

  onClick(row: any): void {
    if (row.expanded) {
      row.expanded = false;
    } else {
      //Request a la API que porta el recompte de 
      this.apiService.generateInteraction(row.id).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error('Error incrementing interaction count', error);
        }
      );
      console.log('this id: ', row.id);
      //console.log(response);
      row.expanded = true;
    }
  }
}
