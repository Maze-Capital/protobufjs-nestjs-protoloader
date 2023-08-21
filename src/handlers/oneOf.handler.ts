import { wrappers } from 'protobufjs';
import { classToPlain } from 'class-transformer';

export function oneOfHandler(protobufPath: string, objKey: string) {
  wrappers[protobufPath] = {
    fromObject: (obj: any) => {
      const key = Object.keys(obj)[0];
      const message = classToPlain(obj);

      message[message[key].$case] = message[key][message[key].$case];
      message[key] = message[key].$case;

      return message;
    },
    toObject: (message: any) => {
      const plainMessage: {[key: string]: any} = classToPlain(message);
      const key: string = Object.keys(message)[0];
      const finalMessage: {[key: string]: any} = {};

      finalMessage[objKey] = key;
      finalMessage[key] = plainMessage[key];

      return { ...plainMessage , ...finalMessage, };
    },
  } as any;
}
