import { Component, computed, input } from '@angular/core';

import { ChartBar } from './chart.types';

/** Gráfico de barras horizontais (CSS puro), ideal para ranking por categoria. */
@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `
    @if (bars().length === 0) {
      <p class="chart-empty">Sem dados para exibir.</p>
    } @else {
      <ul class="chart-bars">
        @for (bar of computedBars(); track bar.label) {
          <li class="chart-bars__row">
            <span class="chart-bars__label" [title]="bar.label">{{ bar.label }}</span>
            <span class="chart-bars__track">
              <span class="chart-bars__fill" [style.width.%]="bar.width" [style.background]="bar.color"></span>
            </span>
            <span class="chart-bars__value">{{ bar.value }}</span>
          </li>
        }
      </ul>
    }
  `,
})
export class BarChartComponent {
  readonly bars = input<ChartBar[]>([]);

  readonly computedBars = computed(() => {
    const max = Math.max(1, ...this.bars().map((b) => b.value));
    return this.bars().map((b) => ({
      ...b,
      width: Math.round((b.value / max) * 100),
    }));
  });
}
