import { animate, animateChild, query, sequence, style, transition, trigger } from "@angular/animations";

export const fadeInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
      })
    ], { optional: true }),
    query(':enter', [ style({ opacity: 0 }) ], { optional: true }),
    query(':leave', [
      sequence([
        animate('400ms ease', style({ opacity: 0 })),
      ]),
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    query(':enter', [
      style({ opacity: 0 }),
      animate('400ms 200ms ease', style({ opacity: 1 })),
    ], { optional: true }),
    query(':enter', animateChild(), { optional: true }),
  ]),
]);