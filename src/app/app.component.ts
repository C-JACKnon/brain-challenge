import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/displays/home/home.component';
import { ChangeComponentService } from './core/services/change-component.service';
import { DisplayComponentType } from './core/enum/display-component.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private changeComponentService: ChangeComponentService,
  ) {}

  ngOnInit(): void {
    this.changeComponentService.changeDisplayComponent(DisplayComponentType.Home);
  }
}
