import { Component } from '@angular/core';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { PageComponentsType } from '../../../core/types/page-components.enum';

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
    this.changeComponentService.changePage(PageComponentsType.Home);
  }

  public onClickStartButton(): void {
    this.changeComponentService.changePage(PageComponentsType.MakeTen);
  }
}
