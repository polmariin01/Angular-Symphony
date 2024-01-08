import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LlistaApiService } from '../llista-api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';

interface Composer {
  id: string;             // Propietats originals
  name: string;
  complete_name: string;
  birth: string;
  death: string;
  epoch: string;
  portrait: string;

  expanded?: boolean;
  count?: number;         // Nombre de clics
  isTrending?: boolean;   // Si es tendencia o no
  works?: any;            // Nombre d'obres
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
  data: Composer[] = [];
  //currentTrending: any;

  constructor(private route : ActivatedRoute, private apiService: LlistaApiService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.letter = params.get('id');
      console.log('OnInit - Letter: ', this.letter)
      this.createData();
    })
  }


  //Generate interaction with the api since an author has been clicked on
  onClick(composer: Composer): void {
    if (composer.expanded) {
      composer.expanded = false;
    } else {
      // Request a la API que porta el recompte de tendencia
      // aqui vaig fer la crida a la api d'aquesta forma, després he vist que es millor creant un observer
      this.apiService.generateInteraction(composer.id).subscribe(
        (response) => {
          //console.log(response);
          composer.count = response.countedInteractions;
        },
        (error) => {
          console.error('Error incrementing interaction count', error);
        }
      );
      //console.log('this id: ', composer.id);
      composer.expanded = true;

      this.updateTrending();
    }
  }



  // CREACIO D'UN DICCIONARI AMB TOTES LES DATES DELS COMPOSITORS
  // DADES NETES, COMPLETES I ORDENADES

  async createData(): Promise<void> {
    //console.log("CREATE DATA");

    // Data from the api, gets the json with every information and stores it in the data variable
    await this.getMainData();

    // Modificació dels objectes de cada compositor. Ens assegurem que no donaran errors de null, afegim a cadascun una variable isTrending i una llista d'obres.
    for (const item of this.data) {
      this.data.forEach((item: any) => {
        if (item.death == null) { //Fa que no falli quan un compositor encara esta viu i death es null
          item.death = 'present';
        }          
      });
      let trendStatus : any = await this.getTrendingStatus(item);
      item.isTrending = trendStatus.isTrending;
      item.count = trendStatus.countedInteractions;
//      item.isTrending = await this.getTrendingStatus(item); // Afegeix propietat booleana de tendencia per saber si s'ha d'afegir algo visual per fer notar que es tendencia
      item.works = await this.getWorks(item);               // Afegeix una llista a cada compositor amb noms d'obres seves.
    };

    this.updateTrending();

    console.log("Objecte amb totes les dades");
    console.log(this.data);
  }


  async getMainData() : Promise<void> {
    //console.log("GET MAIN DATA");
    return new Promise<void>((resolve, reject) => {
      const observer: Observer<any> = {
        next: (response) => {
          if ('composers' in response) {
            this.data = response.composers as any;
            //console.log(this.data);
          }
          resolve();
        },
        error: (error) => {
          console.error('Error getting main data', error);
          reject(error);
        },
        complete: () => {
          // De moment no poso res
        }
      };
  
      // Call the API using the observer
      this.apiService.getData(this.letter).subscribe(observer);
    });
  }
  

  // En aquest cas la crida és a la API
  async getTrendingStatus(composer: Composer): Promise<boolean> {
    // Request to the API for the count of trending status
    //console.log('getTrendingStatus() - composer:', composer.name, composer.id);
  
    // Returning a Promise to handle the asynchronous operation
    return new Promise<boolean>((resolve, reject) => {
      const observer: Observer<any> = {
        next: (response) => {
          console.log(response);
          //console.log('getTrendingStatus() - ' + response.isTrending);
          resolve(response);
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
  async getWorks(composer: Composer): Promise<void> {
    // GET /work/list/composer/129/genre/all.json
    return new Promise<void>((resolve, reject) => {
      
      const observer: Observer<any> = {
        next: (response) => {
          //console.log(response);
          //console.log('getWorks() - ' + response.isTrending);
          // Agafa les primeres tres obres (es pot canviar) i crea un array amb només els noms
          if (Array.isArray(response.works) && response.works.length > 0) {
            const worksTitles = response.works.slice(0,3).map((item: any) => item.title);
            resolve(worksTitles);
          } else {
            console.warn('Empty response.work array');
            resolve();
          }
        },
        error: (error) => {
          console.error('Error getting works', error);
          reject(error);
        },
        complete: () => {
          // Optional: You can perform any cleanup or finalization here
        }
      };
  
      // Call the API using the observer
      this.apiService.getWorks(composer.id).subscribe(observer);
    });
  }


  /**function findPositionByID(composers, ID) {
    const index = composers.findIndex(composer => composer.id === targetId);
  }*/

  // Actualitza l'element
  updateTrending(): void {
//    updateTrending(updatedComposer: any): void {
  // Anava a fer una funcio que mires només l'antic i el més nou, fent-lo bastant més eficient pero menys robust.
  // Al no haver moltes dades no crec que calgui fer-ho tant eficient i així es pot reutilitzar la formula per utilitzar-la al init també.
    console.log("UPDATE TRENDING");

    let maxCount = 0;
    let trendingComposer: Composer | null = null;

    // Busca quin es el que te el count més alt
    this.data.forEach((composer: Composer) => {
      if (composer.count != null && composer.count >= maxCount) {
        maxCount = composer.count;
        trendingComposer = composer;
      }        
    });

/*
    for (const composer of this.data) {
      if (composer.count != null && composer.count >= maxCount) {
        maxCount = composer.count;
        trendingComposer = composer;
      }
    }
*/

    this.data.forEach((composer: Composer) => {
      if (composer === trendingComposer) {
        composer.isTrending = true;
      } else {
        composer.isTrending = false;
      }     
    });

    /*
    if (trendingComposer != null && trendingComposer.name) {
      console.log("Trendng for letter " + this.letter, ":", trendingComposer.name);
    }
    */
    // Actualitza la propietat isTrending de tots els compositors
    /*
    for (const composer of this.data) {
      if (composer === trendingComposer) {
        composer.isTrending = true;
      } else {
        composer.isTrending = false;
      }
    }
    */
  }






  //deprecated  - no s'utilitza pero la deixo per si un cas
  getComposerData(composer: any): void {
    //Request a la API que porta el recompte de 
    this.apiService.getComposerData(composer.id).subscribe(
      (response) => {
        //console.log(response);
        composer.isTrending = response.isTrending;
        //console.log(composer.isTrending);
      },
      (error) => {
        console.error('Error getting composer data', error);
      }
    );
    //console.log('this id: ', row.id);
  }


  // Despres es farà menys cutre
  // Deprecated - no s'utilitza
  trendingMessage(composer: any): string {
    //this.getComposerData(row);
    if (composer.isTrending) {
      return '    TRENDING!!!!!';
    }
    return '';
  }
}
