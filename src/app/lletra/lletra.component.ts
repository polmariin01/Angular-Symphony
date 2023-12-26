import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lletra',
  standalone: true,
  imports: [],
  templateUrl: './lletra.component.html',
  styleUrl: './lletra.component.scss'
})
export class LletraComponent {
  letter: string | null = null;

  constructor(private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.letter = params['id'];
    })
  }
}
