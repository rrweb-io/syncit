import { Chunk, RemoteControlPayload } from '@syncit/core';
import { eventWithTime } from '@rrweb/types';

export enum TransporterEvents {
  SourceReady,
  MirrorReady,
  Start,
  SendRecord,
  AckRecord,
  Stop,
  RemoteControl,
}
export type TransportSendRecordEvent = {
  event: TransporterEvents.SendRecord;
  payload: Chunk<eventWithTime>;
};
export type TransportAckRecordEvent = {
  event: TransporterEvents.AckRecord;
  payload: number;
};
export type TransportRemoteControlEvent = {
  event: TransporterEvents.RemoteControl;
  payload: RemoteControlPayload;
};
export type TransporterHandlers = Record<
  TransporterEvents,
  Array<TransporterEventHandler>
>;

export type TransporterEventHandler = (params: {
  event: TransporterEvents;
  payload?: unknown;
}) => void;

export interface Transporter {
  handlers: Record<TransporterEvents, Array<TransporterEventHandler>>;

  login(): Promise<boolean>;
  sendSourceReady(): Promise<void>;
  sendMirrorReady(): Promise<void>;
  sendStart(): Promise<void>;
  sendRecord(data: Chunk<eventWithTime>): Promise<void>;
  ackRecord(id: number): Promise<void>;
  sendStop(): Promise<void>;
  sendRemoteControl(payload: RemoteControlPayload): Promise<void>;
  on(event: TransporterEvents, handler: TransporterEventHandler): void;
}
