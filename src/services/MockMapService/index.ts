import {
  EventHandlerHash,
  MapServiceEventHandler,
  MapServiceEventMap,
  MapServiceViewpoint
} from "../../types/Events";
import { VGeoJSONLayer, VLayer, VTileLayer } from "../../types/Layer";
import { IMapService } from "../../interfaces/IMapService";
import { MockMap } from "./map";
import { Feature, GeoJsonProperties, Geometry, Position } from 'geojson';


export class MockMapService implements IMapService {
  private _map!: MockMap;
  private _listeners: EventHandlerHash = {
    click: [],
    movestart: [],
    moveend: [],
    mouseover: [],
    hover: [],
  };

  constructor() { }

  queryFeatures(mapPoint: [x: number, y: number]): Feature<Geometry, GeoJsonProperties>[] {
    console.log('you fake queried', mapPoint);
    return [{ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [1, 2] } }];
  }

  setMap(container: string | HTMLElement) {
    this._map = new MockMap(container);
    console.log(this._map);

    const self = this;
    this._map.on('mouseover', (evt) => {
      self.emit('hover', {
        libEvent: evt,
        lng: evt.x,
        lat: evt.y
      })
    })
    this._map.on('click', (evt) => {
      self.emit('click', {
        libEvent: evt,
        lng: evt.x,
        lat: evt.y
      })
    })
  };

  addLayer(layer: VLayer | VGeoJSONLayer | VTileLayer) {
    try {
      this._map.add(layer);
    } catch (error) {
      console.error('[addLayer] Unknown Error:', error);
    }
  };

  addLayers(layers: (VLayer | VGeoJSONLayer | VTileLayer)[]) {
    const addLayer = this.addLayer
    layers.forEach(addLayer);
  };

  removeLayer(layerId: string | number) {
    this._map.remove(layerId);
  };

  removeLayers(layerIds?: (string | number)[] | undefined) {
    if (layerIds === undefined) {
      return this._map.remove('allll the layers!');
    } else {
      layerIds.forEach(this.removeLayer);
    }
  };

  setLayerOpacity({ id, opacity }: Pick<VLayer, "id" | "opacity">) {
    console.log('setLayerOpacity', id, opacity)
  };

  setLayerVisibility({ id, visible }: Pick<VLayer, "id" | "visible">) {
    console.log('setLayerVisibility', id, visible)
  };

  on<E extends keyof MapServiceEventMap>(eventName: E, serviceEventHandler: MapServiceEventHandler<E>) {
    this._listeners[eventName].push(serviceEventHandler);
    return () => {
      const idx = this._listeners[eventName].findIndex((fn) => fn === serviceEventHandler);
      if (idx !== -1) {
        this._listeners[eventName].splice(idx, 1);
      }
    }
  };

  off<E extends keyof MapServiceEventMap>(eventName: E) {
    this._listeners[eventName] = [];
  };

  emit<E extends keyof MapServiceEventMap>(eventName: E, event: MapServiceEventMap[E]): void {
    this._listeners[eventName].forEach((handler) => handler(event));
  }

  goTo(viewpoint: MapServiceViewpoint | Position): void {
    this._map.moveItMoveIt(viewpoint);
  };
}

export default new MockMapService();
