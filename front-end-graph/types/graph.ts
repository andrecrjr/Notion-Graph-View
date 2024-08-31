interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
}

interface Link {
  id?: string | number;
  source: string;
  target: string;
}