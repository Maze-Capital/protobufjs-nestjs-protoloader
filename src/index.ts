import {
  loadSync as _loadSync,
  Options,
  PackageDefinition,
} from '@grpc/proto-loader';
import protobufjs from 'protobufjs';
import { oneOfHandler } from './handlers';

// INFO: https://github.com/protobufjs/protobuf.js/issues/1109#issuecomment-839195109
protobufjs.util.Long = undefined as any;
protobufjs.configure();

export * from './decorators';
export * from './handlers';

export const loadSync = (
  filename: string | string[],
  options?: Options
): PackageDefinition => {
  const preLoadSync = _loadSync(filename, options);
  let propertyKey: keyof typeof preLoadSync;

  for (propertyKey in preLoadSync) {
    const propertyType: any = preLoadSync[propertyKey].type;

    if (propertyType && propertyType.hasOwnProperty("oneofDecl")) {
      const propertyTypeOneOfDecl: { name: string }[] = propertyType["oneofDecl"];

      propertyTypeOneOfDecl.map((oneOfDecl) => {
        if (oneOfDecl && oneOfDecl.name && oneOfDecl.name.substring(0, 1) !== '_') {
          oneOfHandler(`.${propertyKey.toString()}`, oneOfDecl.name);
        }
      });
    }
  }

  return _loadSync(filename, options);
};
