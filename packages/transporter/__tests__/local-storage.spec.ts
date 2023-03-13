/**
 * @jest-environment jsdom
 */

import { LocalStorageTransporter } from '../src/local-storage';
import { TransporterEvents } from '@syncit/core';
import { eventWithTime } from '@rrweb/types';
import { Chunk, RemoteControlActions } from '@syncit/core';

describe('LocalTransporter', () => {
  it('integration test', async () => {
    const transporter = new LocalStorageTransporter();
    const results: Array<{ event: TransporterEvents; payload?: unknown }> = [];
    transporter.on(TransporterEvents.SourceReady, data => {
      results.push(data);
    });
    transporter.on(TransporterEvents.MirrorReady, data => {
      results.push(data);
    });
    transporter.on(TransporterEvents.Start, data => {
      results.push(data);
    });
    transporter.on(TransporterEvents.SendRecord, data => {
      results.push(data);
    });
    transporter.on(TransporterEvents.AckRecord, data => {
      results.push(data);
    });
    transporter.on(TransporterEvents.RemoteControl, data => {
      results.push(data);
    });
    transporter.on(TransporterEvents.Stop, data => {
      results.push(data);
    });
    await transporter.sendSourceReady();
    await transporter.sendMirrorReady();
    await transporter.sendStart();
    await transporter.sendRecord({ id: 1 } as Chunk<eventWithTime>);
    await transporter.ackRecord(1);
    await transporter.sendRemoteControl({
      id: 1,
      action: RemoteControlActions.Scroll,
      x: 0,
      y: 0,
    });
    await transporter.sendStop();
    expect(results).toEqual([
      { event: TransporterEvents.SourceReady },
      { event: TransporterEvents.MirrorReady },
      { event: TransporterEvents.Start },
      { event: TransporterEvents.SendRecord, payload: { id: 1 } },
      { event: TransporterEvents.AckRecord, payload: 1 },
      {
        event: TransporterEvents.RemoteControl,
        payload: { action: RemoteControlActions.Scroll, id: 1, x: 0, y: 0 },
      },
      { event: TransporterEvents.Stop },
    ]);
  });
});
