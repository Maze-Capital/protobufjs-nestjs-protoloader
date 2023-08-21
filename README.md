# Protobuf NestJS ProtoLoader

** STILL UNDER HEAVY DEVELOPMENT **

## Introduction
This project aims to make proto files (oneOf) be correctly handled in NestJS especially for GRPC microservices.

It originates from this PR: https://github.com/stephenh/ts-proto/issues/314

Example of proto file using oneOf declaration:
```
message Example {
  oneof filter {
    FilterById byId = 1;
    FilterBySomethingElse bySomethingElse = 2;
  }
}
```

## Setup
- Your project must be using NestJS 10 (we tried with NestJS 9 but it was too buggy)
- Our proto files are JS compiled invoking `protoc` with those params:
  ```
  --plugin=node_modules/ts-proto/protoc-gen-ts_proto
  --ts_proto_opt=useDate=true
  --ts_proto_opt=nestJs=true
  --ts_proto_opt=oneof=unions
- Import this library in your project (our package.json dependencies: {} as example):
  ```
  "@maze.capital/protobufjs-nestjs-protoloader": "git+ssh://git@github.com:Maze-Capital/protobufjs-nestjs-protoloader.git#main"
  ```
- If you are using ValidationPipe(), it must be set with those settings:
  ```
  whitelist: true
  forbidNonWhitelisted: false
  ```
- When you call `NestFactory.createMicroservice<MicroserviceOptions>()` or anything loading your proto files, you should use our custom protoLoader:
  ```
  options: {
    // ... your settings here
    protoLoader: '@maze.capital/protobufjs-nestjs-protoloader',
    loader: {
      // ... your settings here
      oneofs: true,
    }
  }
  ```
- In your Dto declarations, the models which have a oneOf field should invoke our custom transformer on this field:
  ```
  import { OneOfGRPCTransform } from '@maze.capital/protobufjs-nestjs-protoloader';

  export class ExampleDto {
    @OneOfGRPCTransform({ 'byId': FilterByIdDto, 'bySomethingElse': FilterBySomethingElseDto })
    @ValidateNested({ each: true })
    filter: { $case: "byId"; byId: FilterById } | {
      $case: "bySomethingElse";
      bySomethingElse: FilterBySomethingElse;
    } | undefined;
  }
  ```
