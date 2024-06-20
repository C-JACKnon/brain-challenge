import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { DisplayComponentType } from '../../../core/enum/display-component.enum';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputSwitchModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  {
  public isTimerVisible: boolean = true;


  constructor(
    private changeComponentService: ChangeComponentService,
  ) {}

}
