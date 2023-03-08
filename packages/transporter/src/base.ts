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
// export type TransportEventHandlerParamsSourceReady = {
//   params: { event: TransporterEvents.SourceReady };
// };
// export type TransportEventHandlerParamsMirrorReady = {
//   params: { event: TransporterEvents.MirrorReady };
// };
// export type TransportEventHandlerParamsStart = {
//   params: { event: TransporterEvents.Start };
// };
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
// export type TransportEventHandlerParamsStop = {
//   params: { event: TransporterEvents.Stop };
// };
// export type TransportEventHandlerOuterParams =
//   | TransportEventHandlerParamsSourceReady
//   | TransportEventHandlerParamsMirrorReady
//   | TransportEventHandlerParamsStart
//   | TransportEventHandlerParamsSendRecord
//   | TransportEventHandlerParamsAckRecord
//   | TransportEventHandlerParamsStop
//   | TransportEventHandlerParamsRemoteControl;

// export type TransportEventHandlerParams =
//   | TransportEventHandlerParamsSourceReady['params']
//   | TransportEventHandlerParamsMirrorReady['params']
//   | TransportEventHandlerParamsStart['params']
//   | TransportEventHandlerParamsSendRecord['params']
//   | TransportEventHandlerParamsAckRecord['params']
//   | TransportEventHandlerParamsStop['params']
//   | TransportEventHandlerParamsRemoteControl['params'];

// // export type TransporterEventHandler<T extends TransportEventHandlerParams> = (
// //   params: T
// // ) => void;

// export type TransporterOnArgs =
//   | [
//       event: TransporterEvents.SourceReady,
//       handler: (params: TransportEventHandlerParamsSourceReady) => void
//     ]
//   | [
//       event: TransporterEvents.MirrorReady,
//       handler: (params: TransportEventHandlerParamsMirrorReady) => void
//     ]
//   | [
//       event: TransporterEvents.Start,
//       handler: (params: TransportEventHandlerParamsStart) => void
//     ]
//   | [
//       event: TransporterEvents.SendRecord,
//       handler: (params: TransportEventHandlerParamsSendRecord) => void
//     ]
//   | [
//       event: TransporterEvents.AckRecord,
//       handler: (params: TransportEventHandlerParamsAckRecord) => void
//     ]
//   | [
//       event: TransporterEvents.Stop,
//       handler: (params: TransportEventHandlerParamsStop) => void
//     ]
//   | [
//       event: TransporterEvents.RemoteControl,
//       handler: (params: TransportEventHandlerParamsRemoteControl) => void
//     ];

export type TransporterHandlers = Record<
  TransporterEvents,
  Array<TransporterEventHandler>
>;
// export type TransporterHandlers = {
//   [TransporterEvents.SourceReady]: Array<
//     (params: TransportEventHandlerParamsSourceReady['params']) => void
//   >;
//   [TransporterEvents.MirrorReady]: Array<
//     (params: TransportEventHandlerParamsMirrorReady['params']) => void
//   >;
//   [TransporterEvents.Start]: Array<
//     (params: TransportEventHandlerParamsStart['params']) => void
//   >;
//   [TransporterEvents.SendRecord]: Array<
//     (params: TransportEventHandlerParamsSendRecord['params']) => void
//   >;
//   [TransporterEvents.AckRecord]: Array<
//     (params: TransportEventHandlerParamsAckRecord['params']) => void
//   >;
//   [TransporterEvents.Stop]: Array<
//     (params: TransportEventHandlerParamsStop['params']) => void
//   >;
//   [TransporterEvents.RemoteControl]: Array<
//     (params: TransportEventHandlerParamsRemoteControl['params']) => void
//   >;
// };

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
