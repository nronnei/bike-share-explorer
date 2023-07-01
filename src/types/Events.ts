import { SRID } from "./SRS";

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
 * The coordinates defining a point on the map.
 */
export type MapServicePoint = { lng: number, lat: number }

/**
 * Defines a map viewpoint using a center point and a scale.
 */
export type MapServiceViewpoint = {
  center: MapServicePoint,
  scale: number,
  srid?: SRID
}


export type MapServiceEvent = {
  type: MapServiceEventType,
  libEvent: object,
}

export interface MoveStartEvent extends MapServiceEvent, MapServicePoint {
  type: MapServiceEventType.MoveStart,
}

export interface MoveEndEvent extends MapServiceEvent, MapServicePoint {
  type: MapServiceEventType.MoveEnd,
}

export interface ClickEvent extends MapServiceEvent, MapServicePoint {
  type: MapServiceEventType.Click,
}

export interface MouseOverEvent extends MapServiceEvent, MapServicePoint {
  type: MapServiceEventType.MouseOver,
}

export interface HoverEvent extends MapServiceEvent, MapServicePoint {
  type: MapServiceEventType.Hover,
}

export type MapServiceEventMap = {
  'movestart': MoveStartEvent,
  'moveend': MoveEndEvent,
  'click': ClickEvent,
  'mouseover': MouseOverEvent,
  'hover': HoverEvent,
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
