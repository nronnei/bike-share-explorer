type SupportedEvents = Pick<HTMLElementEventMap, 'click' | 'mouseover'>
type EventHandler<T extends Event> = (evt: T) => any;

export class MockMap {

  private _map: HTMLElement;
  private _listeners: { [E in keyof SupportedEvents]: EventHandler<SupportedEvents[E]>[] } = {
    click: [],
    mouseover: [],
  }

  constructor(container: string | HTMLElement) {
    if (!container) throw TypeError('Must specify a container element or element id.');
    if (typeof container === 'string') this._map = document.getElementById(container) as HTMLElement;
    else this._map = container
  }

  on<E extends keyof SupportedEvents>(eventName: E, eventHandler: EventHandler<SupportedEvents[E]>): void {
    this._map.addEventListener(eventName, eventHandler);
    this._listeners[eventName].push(eventHandler);
  }

  off<E extends keyof SupportedEvents>(eventName: E): void {
    this._listeners[eventName].forEach(l => this._map.removeEventListener(eventName, l));
  }

  add(layer: any) {
    console.log('added', layer);
    return;
  }

  remove(layer: any) {
    console.log('removed', layer);
    return
  }

  moveItMoveIt(args: any) {
    console.log('movin\' it!', args);
    return;
  }
}
