import { Component, computed, input } from '@angular/core';

import { ChartSlice } from './chart.types';

interface Segment {
  d: string;
  color: string;
  label: string;
  value: number;
  pct: number;
  full: boolean;
}

/**
 * Gráfico de pizza/rosca em SVG puro (sem dependências).
 * `innerRadius` = 0 → pizza; entre 0 e 1 → rosca (donut) com furo central.
 */
@Component({
  selector: 'app-pie-chart',
  standalone: true,
  template: `
    <div class="chart-pie">
      <svg
        [attr.viewBox]="'0 0 ' + size() + ' ' + size()"
        [style.width.px]="size()"
        [style.height.px]="size()"
        class="chart-pie__svg"
        role="img"
        [attr.aria-label]="ariaLabel()"
      >
        @if (total() === 0) {
          <circle
            [attr.cx]="size() / 2"
            [attr.cy]="size() / 2"
            [attr.r]="radius()"
            fill="none"
            stroke="var(--border)"
            stroke-width="2"
          />
        } @else {
          @for (seg of segments(); track seg.label) {
            @if (seg.full) {
              <circle [attr.cx]="size() / 2" [attr.cy]="size() / 2" [attr.r]="radius()" [attr.fill]="seg.color" />
            } @else {
              <path [attr.d]="seg.d" [attr.fill]="seg.color" />
            }
          }
          @if (innerRadius() > 0) {
            <circle
              [attr.cx]="size() / 2"
              [attr.cy]="size() / 2"
              [attr.r]="radius() * innerRadius()"
              fill="var(--surface)"
            />
            @if (centerValue()) {
              <text [attr.x]="size() / 2" [attr.y]="size() / 2 - 2" text-anchor="middle" class="chart-pie__center-value">
                {{ centerValue() }}
              </text>
              <text [attr.x]="size() / 2" [attr.y]="size() / 2 + 16" text-anchor="middle" class="chart-pie__center-label">
                {{ centerLabel() }}
              </text>
            }
          }
        }
      </svg>

      <ul class="chart-legend">
        @for (seg of segments(); track seg.label) {
          <li class="chart-legend__item">
            <span class="chart-legend__dot" [style.background]="seg.color"></span>
            <span class="chart-legend__label">{{ seg.label }}</span>
            <span class="chart-legend__value">{{ seg.value }} · {{ seg.pct }}%</span>
          </li>
        } @empty {
          <li class="chart-legend__empty">Sem dados no período.</li>
        }
      </ul>
    </div>
  `,
})
export class PieChartComponent {
  readonly slices = input<ChartSlice[]>([]);
  readonly innerRadius = input(0);
  readonly size = input(180);
  readonly centerValue = input('');
  readonly centerLabel = input('');

  readonly radius = computed(() => this.size() / 2 - 2);
  readonly total = computed(() => this.slices().reduce((sum, s) => sum + s.value, 0));

  readonly ariaLabel = computed(() =>
    this.segments()
      .map((s) => `${s.label}: ${s.value}`)
      .join(', '),
  );

  readonly segments = computed<Segment[]>(() => {
    const total = this.total();
    if (total === 0) {
      return [];
    }
    const cx = this.size() / 2;
    const cy = this.size() / 2;
    const r = this.radius();
    let angle = 0;
    return this.slices()
      .filter((s) => s.value > 0)
      .map((s) => {
        const sweep = (s.value / total) * 360;
        const start = angle;
        const end = angle + sweep;
        angle = end;
        const full = s.value === total;
        return {
          d: full ? '' : this.wedge(cx, cy, r, start, end),
          color: s.color,
          label: s.label,
          value: s.value,
          pct: Math.round((s.value / total) * 100),
          full,
        };
      });
  });

  private wedge(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
    const start = this.polar(cx, cy, r, endAngle);
    const end = this.polar(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
  }

  private polar(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }
}
