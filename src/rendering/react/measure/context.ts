import { measureElement } from "ink";
import { createContext, ReactNode, useContext } from "react";
import { ObservableValue } from "../lib/observable-value/ObservableValue.js";

export type MeasureContextNodes = Record<string, ReactNode>;

export type Dimension = ReturnType<typeof measureElement>;
export type Dimensions = Record<string, ObservableValue<Dimension>>;

interface Context {
  nodes: ObservableValue<MeasureContextNodes>;
  dimensions: Dimensions;
  addNode: (id: string, node: ReactNode) => void;
  removeNode: (id: string) => void;
  getDimension: (id: string) => ObservableValue<Dimension>;
  updateDimension: (id: string, dimension: Dimension) => void;
}

export const createMeasureContext = (): Context => {
  const context: Context = {
    nodes: new ObservableValue<MeasureContextNodes>({}),

    dimensions: {},

    addNode: (id, node) => {
      const existing = context.nodes.value[id];
      if (existing === node) {
        return;
      }

      context.dimensions[id] = new ObservableValue<Dimension>({
        height: 0,
        width: 0,
      });

      context.nodes.updateValue({
        ...context.nodes.value,
        [id]: node,
      });
    },

    removeNode: (id) => {
      if (id in context.nodes) {
        const updatedNodes = {
          ...context.nodes.value,
        };
        delete updatedNodes[id];
        context.nodes.updateValue(updatedNodes);
      }
    },

    getDimension: (id) => {
      const dimension = context.dimensions[id];
      if (!dimension) {
        throw new Error(`Could not get dimension for ${id}`);
      }
      return dimension;
    },

    updateDimension: (id, updatedDimension) => {
      const dimension = context.getDimension(id);
      if (
        dimension.value.width !== updatedDimension.width ||
        dimension.value.height !== updatedDimension.height
      ) {
        dimension.updateValue(updatedDimension);
      }
    },
  };

  return context;
};

export const measureContext = createContext<Context>(createMeasureContext());

export const useMeasureContext = (): Context => useContext(measureContext);
