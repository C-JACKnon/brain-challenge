import { AfterViewInit, Component, OnInit } from '@angular/core';
import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';

@Component({
  selector: 'app-make-ten',
  standalone: true,
  imports: [],
  templateUrl: './make-ten.component.html',
  styleUrl: './make-ten.component.scss'
})
export class MakeTenComponent implements OnInit, AfterViewInit {
  private stage: Stage | null = null;
  private stageHeight: number = 0;
  private stageWidth: number = 0;

  ngOnInit(): void {
    this.stageHeight = window.innerHeight;
    this.stageWidth = window.innerWidth;
  }

  ngAfterViewInit(): void {
    this.stage = new Konva.Stage({
      container: 'container',
      width: this.stageWidth,
      height: this.stageHeight,
    });
    // add canvas element
    var layer = new Konva.Layer();
    this.stage.add(layer);

    // create shape
    var box = new Konva.Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
    });
    layer.add(box);

    // add cursor styling
    box.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    box.on('mouseout', function () {
      document.body.style.cursor = 'default';
    });
  }
}
