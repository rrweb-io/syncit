/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createMachine, interpret, assign, EventObject } from '@xstate/fsm';
import { Replayer, record } from 'rrweb';
import { listenerHandler, eventWithTime } from '@rrweb/types';
import { Transporter } from '@syncit/transporter';
import { SourceBuffer, Chunk } from './buffer';
import { onMirror, RemoteControlActions, CustomEventTags } from './common';

export const createAppService = (onStop: () => void) => {
  return interpret(
    createMachine(
      {
        initial: 'idle',
        states: {
          idle: {
            on: {
              SOURCE_READY: {
                target: 'waiting_first_record',
              },
            },
          },
          waiting_first_record: {
            on: {
              FIRST_RECORD: {
                target: 'connected',
              },
            },
          },
          connected: {
            on: {
              STOP: {
                target: 'stopped',
                actions: ['stop'],
              },
            },
          },
          stopped: {
            on: {
              RESET: 'idle',
            },
          },
        },
      },
      {
        actions: {
          stop: onStop,
        },
      }
    )
  );
};

type AppControlContext = {
  transporter: Transporter<unknown>;
  stopControl?: listenerHandler;
  replayer?: Replayer;
};

export const createAppControlService = (
  context: Omit<AppControlContext, 'stopControl'>
) => {
  return interpret(
    createMachine<AppControlContext>(
      {
        context: context,
        initial: 'not_control',
        states: {
          not_control: {
            on: {
              REQUEST: {
                target: 'requested',
                actions: ['request'],
              },
            },
          },
          requested: {
            on: {
              ACCEPTED: {
                target: 'controlling',
                actions: ['accepted'],
              },
            },
          },
          controlling: {
            on: {
              STOP_CONTROL: {
                target: 'not_control',
                actions: ['stopControl'],
              },
            },
          },
        },
      },
      {
        actions: {
          request(context) {
            context.transporter.sendRemoteControl({
              action: RemoteControlActions.Request,
            });
          },
          accepted: assign((context, event) => {
            const { transporter } = context;
            const { replayer } = (event as EventObject & {
              payload: { replayer: Replayer };
            }).payload;
            if (!replayer) {
              throw new Error('Replayer should be inited.');
            }
            replayer.enableInteract();
            return {
              ...context,
              stopControl: onMirror(
                replayer.getMirror(),
                replayer.iframe,
                payload => {
                  transporter.sendRemoteControl(payload);
                }
              ),
              replayer,
            };
          }),
          stopControl(context) {
            const { transporter, replayer, stopControl } = context;
            if (!replayer) {
              throw new Error('Replayer should be inited.');
            }
            transporter.sendRemoteControl({
              action: RemoteControlActions.Stop,
            });
            replayer.disableInteract();
            if (stopControl) {
              stopControl();
            }
          },
        },
      }
    )
  );
};

type EmbedContext = {
  transporter: Transporter<Chunk<eventWithTime>>;
  record: typeof record;
  stopRecordFn: listenerHandler | null;
  buffer: SourceBuffer<eventWithTime>;
};

export const createEmbedService = (context: EmbedContext) => {
  return interpret(
    createMachine<EmbedContext>(
      {
        context,
        initial: 'idle',
        states: {
          idle: {
            on: {
              START: {
                target: 'ready',
                actions: ['start'],
              },
            },
          },
          ready: {
            on: {
              CONNECT: {
                target: 'connected',
                actions: ['connect'],
              },
            },
          },
          connected: {
            on: {
              STOP: {
                target: 'idle',
                actions: ['stop'],
              },
              CONNECT: {
                target: 'connected',
                actions: ['connect'],
              },
            },
          },
        },
      },
      {
        actions: {
          start() {},
          connect: assign(context => {
            const { record, buffer, transporter, stopRecordFn } = context;
            // reset before connect
            stopRecordFn?.();
            buffer.reset();
            // start a session
            const stopRecord = record({
              emit(event) {
                const id = buffer.add(event);
                transporter.sendRecord(buffer.buffer[id]);
              },
              inlineStylesheet: false,
            });
            return {
              ...context,
              stopRecordFn: () => {
                stopRecord?.();
              },
            };
          }),
          stop(context) {
            const { stopRecordFn, transporter, buffer } = context;
            stopRecordFn?.();
            transporter.sendStop();
            buffer.reset();
          },
        },
      }
    )
  );
};

type EmbedControlContext = {
  record: typeof record;
};

export const createEmbedControlService = (context: EmbedControlContext) => {
  return interpret(
    createMachine<EmbedControlContext>(
      {
        context,
        initial: 'not_control',
        states: {
          not_control: {
            on: {
              REQUEST: {
                target: 'requesting',
              },
            },
          },
          requesting: {
            on: {
              ACCEPT: {
                target: 'controlled',
                actions: ['accept'],
              },
            },
          },
          controlled: {
            on: {
              STOP: {
                target: 'not_control',
              },
            },
          },
        },
      },
      {
        actions: {
          accept(context) {
            context.record.addCustomEvent(
              CustomEventTags.AcceptRemoteControl,
              undefined
            );
          },
        },
      }
    )
  );
};
