import { Component, computed, input } from '@angular/core';

import { ChartPoint } from './chart.types';

let instanceCounter = 0;

/** Gráfico de linha (evolução temporal) em SVG puro, responsivo via viewBox. */
@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: `
    @if (points().length === 0) {
      <p class="chart-empty">Sem dados para exibir.</p>
    } @else {
      <svg viewBox="0 0 900 200" class="chart-line" role="img" [attr.aria-label]="ariaLabel()">
        <!-- linhas de grade -->
        @for (g of geometry().grid; track g.y) {
          <line x1="44" [attr.y1]="g.y" x2="884" [attr.y2]="g.y" stroke="var(--border)" stroke-width="1" />
          <text x="36" [attr.y]="g.y + 4" text-anchor="end" class="chart-axis">{{ g.value }}</text>
        }
        <!-- área + linha -->
        <path [attr.d]="geometry().area" [attr.fill]="'url(#lg-' + uid + ')'" opacity="0.18" />
        <path [attr.d]="geometry().line" fill="none" [attr.stroke]="color()" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" />
        <defs>
          <linearGradient [attr.id]="'lg-' + uid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" [attr.stop-color]="color()" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
        </defs>
        <!-- pontos + rótulos do eixo x -->
        @for (d of geometry().dots; track d.label) {
          <circle [attr.cx]="d.x" [attr.cy]="d.y" r="3.5" [attr.fill]="color()" stroke="var(--surface)" stroke-width="2" />
          <text [attr.x]="d.x" y="194" text-anchor="middle" class="chart-axis">{{ d.label }}</text>
        }
      </svg>
    }
  `,
})
export class LineChartComponent {
  readonly points = input<ChartPoint[]>([]);
  readonly color = input('#2f9e41');

  // id único e estável para o gradiente (evita colisão entre instâncias).
  readonly uid = ++instanceCounter;

  readonly ariaLabel = computed(() =>
    this.points()
      .map((p) => `${p.label}: ${p.value}`)
      .join(', '),
  );

  readonly geometry = computed(() => {
    const pts = this.points();
    const W = 900;
    const H = 200;
    const padL = 44;
    const padR = 16;
    const padT = 16;
    const padB = 34;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;
    const max = Math.max(1, ...pts.map((p) => p.value));
    const n = pts.length;

    const x = (i: number) => (n === 1 ? padL + innerW / 2 : padL + (i / (n - 1)) * innerW);
    const y = (v: number) => padT + innerH - (v / max) * innerH;

    const dots = pts.map((p, i) => ({ x: x(i), y: y(p.value), label: p.label, value: p.value }));
    const line = dots.map((d, i) => `${i === 0 ? 'M' : 'L'} ${d.x.toFixed(1)} ${d.y.toFixed(1)}`).join(' ');
    const baseline = padT + innerH;
    const area =
      dots.length > 0
        ? `${line} L ${dots[dots.length - 1].x.toFixed(1)} ${baseline} L ${dots[0].x.toFixed(1)} ${baseline} Z`
        : '';

    const steps = 3;
    const grid = Array.from({ length: steps + 1 }, (_, i) => {
      const value = Math.round((max / steps) * (steps - i));
      return { y: padT + (innerH / steps) * i, value };
    });

    return { line, area, dots, grid };
  });
}
