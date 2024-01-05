import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LlistaApiService } from '../llista-api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Composer {
  id: string;
  name: string;
  complete_name: string;
  birth: string;
  death: string | null;
  epoch: string;

  //isTrending?: boolean; // Add the optional property here
}



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
      console.log('OnInit - Letter: ', this.letter)
      this.createData();
    })
  }

  createData(): void {
    // Data from the api, gets the json with every information and stores it in the data variable
    this.apiService.getData(this.letter).subscribe(
      (response) => {
        if ('composers' in response) {
          //this.data = response.composers;
          this.data = response.composers as Composer[];
        }
//        this.data = response;
        console.log('\tgetData() - ');
        console.log(this.data);
      });


    // Create the aditional information we need in the data, for each composer
    this.data.forEach((item: any) => {
      // Null problem with alive composers
      if (item.death == null) {
        item.death = 'present';
      }

      // Trending Status in the local API
      item.isTrending = this.getTrendingStatus(item);

      //Works of the composer
      item.works = this.getWorks(item);
    })
    // Trending Status
  }

  //Generate interaction with the api since an author has been clicked on
  onClick(row: any): void {
    if (row.expanded) {
      row.expanded = false;
    } else {
      //Request a la API que porta el recompte de 
      this.apiService.generateInteraction(row.id).subscribe(
        (response) => {
          console.log(response);
          row.count = response.countedInteractions;
        },
        (error) => {
          console.error('Error incrementing interaction count', error);
        }
      );
      console.log('this id: ', row.id);
      row.expanded = true;
    }
  }

  //deprecated
  getComposerData(row: any): void {
    //Request a la API que porta el recompte de 
    this.apiService.getComposerData(row.id).subscribe(
      (response) => {
        console.log(response);
        row.isTrending = response.isTrending;
        console.log(row.isTrending);
      },
      (error) => {
        console.error('Error getting composer data', error);
      }
    );
    console.log('this id: ', row.id);
  }


  getTrendingStatus(composer: any) : boolean {
    //Request a la API que porta el recompte de 
    console.log('getTrendingStatus() - composer:', composer.name, composer.id);
    this.apiService.getComposerData(composer.id).subscribe(
      (response) => {
        console.log('getTrendingStatus() - ' + response);
        console.log(response);
        console.log('getTrendingStatus() - ' + composer.isTrending);
        return response.isTrending;
      },
      (error) => {
        console.error('Error getting composer data', error);
      }
    );
    console.log('getTrendingStatus() - didnt work');
    return false;
  }

  //TODO
  getWorks(composer: any): void {
    // GET /work/list/composer/129/genre/all.json
  }


  // Despres es farà menys cutre
  trendingMessage(composer: any): string {
    //this.getComposerData(row);
    if (composer.isTrending) {
      return '  TRENDING!!!';
    }
    return ' - mediocre';
  }
}
