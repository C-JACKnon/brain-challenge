import { Component } from '@angular/core';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { PAGE_ADDRESS } from '../../../app.routes';

@Component({
  selector: 'app-how-to',
  standalone: true,
  imports: [],
  templateUrl: './how-to.component.html',
  styleUrl: './how-to.component.scss'
})
export class HowToComponent {
  constructor(
    private changeComponentService: ChangeComponentService,
  ) { }
  
  public onClickReturnButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.HOME);
  }

  public onClickStartButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.MAKE_TEN);
  }
}
