// import "leaflet/dist/leaflet.css"
import L, {
  Map as LeafletMap,
  LeafletEvent,
  LeafletMouseEvent,
  FeatureGroup,
} from "leaflet";
import {
  EventHandlerHash,
  MapServiceEventHandler,
  MapServiceEventMap,
  MapServiceViewpoint,
} from "../../types/Events";
import { VGeoJSONLayer, VLayer, VTileLayer } from "../../types/Layer";
import { IMapService } from "../../interfaces/IMapService";
import { LeafletTileLayer } from './types';
import { Feature, Geometry, GeoJsonProperties, Position } from 'geojson';
import makeCircle from '@turf/circle';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';


export class LeafletMapService implements IMapService {
  private _map!: LeafletMap;
  private _layerCache = new Map();
  private _listeners: EventHandlerHash = {
    click: [],
    movestart: [],
    moveend: [],
    mouseover: [],
    hover: [],
  };

  constructor() { }

  setMap(container: string | HTMLElement) {
    // if (this._map) this._map.remove();
    this._map = L.map(container, {
      center: { lng: -85.572, lat: 44.707 },
      zoom: 8,
    });

    const baseLayerConfig: VTileLayer = {
      id: '__base',
      type: 'tile',
      name: 'Basemap',
      url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
      visible: true,
      opacity: 1,
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abcd',
      minZoom: 1,
      maxZoom: 16,
    }

    this.addLayer(baseLayerConfig)

    const self = this;

    this._map.on('movestart', (evt: LeafletEvent) => {
      const { lat, lng } = self._map.getCenter();
      self.emit('movestart', { libEvent: evt, lng, lat })
    })

    this._map.on('moveend', (evt: LeafletEvent) => {
      const { lat, lng } = self._map.getCenter();
      self.emit('moveend', { libEvent: evt, lng, lat })
    })

    this._map.on('click', (evt: LeafletMouseEvent) => {
      const { lat, lng } = evt.latlng;
      self.emit('click', { libEvent: evt, lng, lat })
    })
  };

  addLayer(layer: VLayer | VGeoJSONLayer | VTileLayer) {
    try {
      if (this._layerCache.has(layer.id)) return;
      const leafletLayer = this.createLayer(layer);
      this._layerCache.set(layer.id, leafletLayer);
      leafletLayer.addTo(this._map);
    } catch (error) {
      console.error('[addLayer] Unknown Error:', error);
    }
  };

  addLayers(layers: (VLayer | VGeoJSONLayer | VTileLayer)[]) {
    const addLayer = this.addLayer
    layers.forEach(addLayer);
  };

  removeLayer(layerId: string | number) {
    const targetLayer = this._layerCache.get(layerId);
    if (targetLayer) {
      targetLayer.remove();
      this._layerCache.delete(layerId);
    }
  };

  removeLayers(layerIds?: (string | number)[] | undefined) {
    if (layerIds === undefined) {
      return this._map.eachLayer(l => l.remove());
    } else {
      layerIds.forEach(this.removeLayer);
    }
  };

  /**
   * Delete a layer from the service's cache.
   * @param layerId ID of the layer to delete.
   */
  deleteLayer(layerId: string | number) {
    this.removeLayer(layerId);
    this._layerCache.delete(layerId);
  }

  setLayerOpacity({ id, opacity }: Pick<VLayer, "id" | "opacity">) {
    const leafletLayer = this._layerCache.get(id);
    if (!leafletLayer) throw ReferenceError(`Layer ${id} not found.`);
    leafletLayer.setOpacity(opacity);
  };

  setLayerVisibility({ id, visible }: Pick<VLayer, "id" | "visible">) {
    const leafletLayer = this._layerCache.get(id);
    if (!leafletLayer) throw ReferenceError(`Layer ${id} not found.`);
    const opacity = visible ? 1 : 0;
    this.setLayerOpacity({ id, opacity });
  };

  queryFeatures(mapPoint: [x: number, y: number]): Feature<Geometry, GeoJsonProperties>[] {
    let results: Feature[] = [];

    const southEastPoint = this._map.getBounds().getSouthEast();
    const northEastPoint = this._map.getBounds().getNorthEast();
    const mapHeightInMetres = southEastPoint.distanceTo(northEastPoint);
    const mapHeightInPixels = this._map.getSize().y;
    const radius = (mapHeightInMetres / mapHeightInPixels) * 20;
    const circle = makeCircle(mapPoint, radius / 1000);

    // @TODO: get rid of some of these nested if statements ASAP
    this._map.eachLayer((layer) => {
      if (layer instanceof FeatureGroup) {
        layer.eachLayer((featureLayer) => {
          if (featureLayer.feature?.type === 'Feature') {
            const feature = featureLayer.feature as Feature;
            if (feature.geometry?.type === 'Point' && booleanPointInPolygon(feature.geometry, circle)) {
              results.push(feature);
            }
          }
        });
      }
    });
    console.log('results', results);

    return results
  }

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
    if (Array.isArray(viewpoint)) {
      const [x, y] = viewpoint;
      // Leaflet's backwards coordinates 🙄
      this._map.flyTo([y, x]);
    } else {
      const [x, y] = viewpoint.center;
      const zoom = viewpoint.scale;
      // Leaflet's backwards coordinates 🙄
      this._map.flyTo([y, x], zoom);
    }
  };

  private createLayer(layerConfig: VTileLayer | VGeoJSONLayer) {
    const possibleError = ReferenceError(`Layer type "${layerConfig.type}" not supported.`);
    switch (layerConfig.type) {
      case 'tile':
        return this.createTileLayer(layerConfig);
      case 'geojson':
        return this.createGeoJSONLayer(layerConfig);
      default:
        throw possibleError;
    }
  }

  private createTileLayer(layerConfig: LeafletTileLayer) {
    try {
      const { url, attribution, subdomains, minZoom, maxZoom, ext } = layerConfig;
      const tLayer = L.tileLayer(url, { attribution, subdomains, minZoom, maxZoom });
      return tLayer;
    } catch (error) {
      console.error('[createTileLayer]', error);
      throw error;
    }
  }

  private createGeoJSONLayer(layerConfig: VGeoJSONLayer) {
    try {
      return L.geoJSON(layerConfig.features, {
        pointToLayer: (point, latlng) => {
          return L.circleMarker(latlng);
        },
        style: { color: "var(--chakra-colors-red-500)", weight: 5 },
      });
    } catch (error) {
      console.error('[createGeoJSONLayer]', error);
      throw error;
    }
  }
}

export default new LeafletMapService();
