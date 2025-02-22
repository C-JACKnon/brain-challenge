import { animate, animateChild, query, sequence, style, transition, trigger } from "@angular/animations";
import { VisiblePageAnimationTimeFirst, VisiblePageAnimationTimeSecond } from "./core/constants";

export const fadeInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        height: '100%',
        width: '100%',
      })
    ], { optional: true }),
    query(':enter', [ style({ opacity: 0 }) ], { optional: true }),
    query(':leave', [
      sequence([
        animate('300ms ease', style({ opacity: 0 })),
      ]),
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    query(':enter', [
      style({ opacity: 0 }),
      animate(VisiblePageAnimationTimeFirst + 'ms ' + VisiblePageAnimationTimeSecond + 'ms ease', style({ opacity: 1 })),
    ], { optional: true }),
    query(':enter', animateChild(), { optional: true }),
  ]),
]);