import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LlistaApiService } from '../llista-api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Observer } from 'rxjs';

interface Composer {
  id: string;
  name: string;
  complete_name: string;
  birth: string;
  death: string | null;
  epoch: string;

  isTrending?: boolean; // Add the optional property here
  works?: any;
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




  async createData(): Promise<void> {
    console.log("CREATE DATA");
    // Data from the api, gets the json with every information and stores it in the data variable

    await this.getMainData();



    for (const item of this.data) {
      this.data.forEach((item: any) => {
        if (item.death == null) {
          item.death = 'present';
        }          
      });
      item.isTrending = await this.getTrendingStatus(item);
      item.works = await this.getWorks(item);
    };

    console.log("Final data object.");
    console.log(this.data);
  }



/**
 * 
  createData(): void {
    console.log("CREATE DATA");
    // Data from the api, gets the json with every information and stores it in the data variable
    this.apiService.getData(this.letter).subscribe(
      (response) => {
        if ('composers' in response) {
          //this.data = response.composers;
          this.data = response.composers as Composer[];
          console.log(this.data);
          console.log('\tgetData() - ');

          this.data.forEach(async (item: any)) => {
            if (item.death == null) {
              item.death = 'present';
            }          
          }
        }
//        this.data = response;

        //console.log(this.data);


      }
    );


    // Create the aditional information we need in the data, for each composer
    this.data.forEach((item: any) => {
      // Null problem with alive composers
      if (item.death == null) {
        item.death = 'present';
      }

      // Trending Status in the local API
      item.isTrending = await this.getTrendingStatus(item);

      //Works of the composer
      item.works = this.getWorks(item);
    });

    console.log("Final data object.");
    console.log(this.data);
  }
 * 
 * 
 * 
 */




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


  async getMainData() : Promise<void> {
    console.log("GET MAIN DATA");
    return new Promise<void>((resolve, reject) => {
      const observer: Observer<any> = {
        next: (response) => {
          if ('composers' in response) {
            this.data = response.composers as Composer[];
            console.log(this.data);
          }
          resolve();
        },
        error: (error) => {
          console.error('Error getting main data', error);
          reject(error);
        },
        complete: () => {
          // Optional: You can perform any cleanup or finalization here
        }
      };
  
      // Call the API using the observer
      this.apiService.getData(this.letter).subscribe(observer);
    });
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

/**
  async getTrendingStatus(composer: any) : Promise<boolean> {
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
  */

  async getTrendingStatus(composer: Composer): Promise<boolean> {
    // Request to the API for the count of trending status
    console.log('getTrendingStatus() - composer:', composer.name, composer.id);
  
    // Returning a Promise to handle the asynchronous operation
    return new Promise<boolean>((resolve, reject) => {
      const observer: Observer<any> = {
        next: (response) => {
          console.log('getTrendingStatus() - ' + response);
          console.log(response);
          console.log('getTrendingStatus() - ' + composer.isTrending);
          resolve(response.isTrending);
        },
        error: (error) => {
          console.error('Error getting composer data', error);
          reject(error);
        },
        complete: () => {
          // Optional: You can perform any cleanup or finalization here
        }
      };
  
      // Call the API using the observer
      this.apiService.getComposerData(composer.id).subscribe(observer);
    });
  }
  

  //TODO
  async getWorks(composer: any): Promise<any> {
    //return [];
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
