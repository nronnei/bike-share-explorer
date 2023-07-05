import { Point } from 'geojson';
import { SRID } from "./SRS";
import { Position } from 'geojson';

/**
 * The custom events we need to support on MapService implementations.
 */
export enum MapServiceEventType {
  MoveStart = 'movestart',
  MoveEnd = 'moveend',
  Click = 'click',
  MouseOver = 'mouseover',
  Hover = 'hover',
};

/**
 * Defines a map viewpoint using a center point and a scale.
 */
export type MapServiceViewpoint = {
  center: Position,
  scale: number,
}

export type MapServiceEvent = {
  /**
   * The event emitted by the underlying map library.
   */
  libEvent: object,
  /**
   * Longitude where the event occurred. For map move events, corresponds to the
   * center of the viewport.
   */
  lng: number,
  /**
   * Latitude where the event occurred. For map move events, corresponds to the
   * center of the viewport.
   */
  lat: number,
}

export interface MapMouseEvent extends MapServiceEvent { };
export interface MapMoveEvent extends MapServiceEvent { };

export type MapServiceEventMap = {
  'movestart': MapMoveEvent,
  'moveend': MapMoveEvent,
  'click': MapMouseEvent,
  'mouseover': MapMouseEvent,
  'hover': MapMouseEvent,
}

export type MapServiceEventHandler<T extends keyof MapServiceEventMap> = (event: MapServiceEventMap[T]) => void

export interface MapServiceEventEmitter {
  /**
   * Emits a MapServiceEvent.
   * @param name Name of the event to emit
   * @param event Event objecgt
   */
  emit<E extends keyof MapServiceEventMap>(name: E, event: MapServiceEventMap[E]): void
  /**
   * Registers a listener for a MapServiceEvent
   * @param eventName Name of the event to listen for.
   * @param serviceEventHandler Event handler function.
   * @returns A function to de-register the event handler.
   */
  on<E extends keyof MapServiceEventMap>(name: E, handler: MapServiceEventHandler<E>): () => void
  /**
   * De-registers all event listeners for the target event.
   * @param eventName Name of the event to remove listeners for.
   * @returns void
   */
  off<E extends keyof MapServiceEventMap>(name: E): void
}

/**
   * Helper type for classes that implement the MapServiceEventEmitter interface.
   */
export type EventHandlerHash = {
  [E in keyof MapServiceEventMap]: MapServiceEventHandler<E>[]
};
