/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { eventWithTime } from '@rrweb/types';
import { Chunk, RemoteControlPayload } from '@syncit/core';
import {
  Transporter,
  TransporterEvents,
  TransporterHandlers,
  TransporterEventHandler,
} from './base';

const STORAGE_KEY = '__transporter_message__';
export class LocalStorageTransporter implements Transporter {
  handlers: TransporterHandlers = {
    [TransporterEvents.SourceReady]: [],
    [TransporterEvents.MirrorReady]: [],
    [TransporterEvents.Start]: [],
    [TransporterEvents.SendRecord]: [],
    [TransporterEvents.AckRecord]: [],
    [TransporterEvents.Stop]: [],
    [TransporterEvents.RemoteControl]: [],
  };

  constructor() {
    localStorage.removeItem(STORAGE_KEY);
    window.addEventListener('storage', e => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const message: Parameters<TransporterEventHandler>[0] = JSON.parse(
          e.newValue
        );
        this.handlers[message.event].map(h => h(message));
      }
    });
  }

  login() {
    return Promise.resolve(true);
  }

  setItem(params: { event: TransporterEvents; payload?: unknown }) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    // jest could not listen to storage event in JSDOM, not a big deal at here.
    if (process.env.NODE_ENV === 'test') {
      this.handlers[params.event].map(h => h(params));
    }
  }

  sendSourceReady() {
    this.setItem({
      event: TransporterEvents.SourceReady,
    });
    return Promise.resolve();
  }

  sendMirrorReady() {
    this.setItem({
      event: TransporterEvents.MirrorReady,
    });
    return Promise.resolve();
  }

  sendStart() {
    this.setItem({
      event: TransporterEvents.Start,
    });
    return Promise.resolve();
  }

  sendRecord(record: Chunk<eventWithTime>) {
    this.setItem({
      event: TransporterEvents.SendRecord,
      payload: record,
    });
    return Promise.resolve();
  }

  ackRecord(id: number) {
    this.setItem({
      event: TransporterEvents.AckRecord,
      payload: id,
    });
    return Promise.resolve();
  }

  sendStop() {
    this.setItem({
      event: TransporterEvents.Stop,
    });
    return Promise.resolve();
  }

  sendRemoteControl(payload: RemoteControlPayload) {
    this.setItem({
      event: TransporterEvents.RemoteControl,
      payload,
    });
    return Promise.resolve();
  }

  on(event: TransporterEvents, handler: TransporterEventHandler) {
    this.handlers[event].push(handler);
  }
}
