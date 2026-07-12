/** Modelos compartilhados pelos componentes de gráfico (SVG/CSS, sem dependências). */
export interface ChartSlice {
  label: string;
  value: number;
  color: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ChartBar {
  label: string;
  value: number;
  color: string;
}
