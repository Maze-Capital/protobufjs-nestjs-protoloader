import { Transform, plainToClass } from 'class-transformer';

export function OneOfGRPCTransform(
  options: any = {}
): PropertyDecorator {
  return Transform(({ value, key, obj, type }) => {
    // INFO: We want this Transformer to be working only for GRPC oneof handling
    if (typeof value !== 'string') return value;

    let propertyKey: keyof typeof options;

    for (propertyKey in options) {
      if (obj[propertyKey] && obj.hasOwnProperty(propertyKey)) {
        return plainToClass(options[propertyKey], obj[propertyKey]);
      }
    }

    throw new Error("Should never go there");
  }, { toClassOnly: true });
}
