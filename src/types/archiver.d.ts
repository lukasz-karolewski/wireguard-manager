declare module "archiver" {
  import type { Transform } from "node:stream";

  interface ZipEntryData {
    date?: Date | string;
    mode?: number;
    name: string;
    prefix?: string;
    stats?: import("node:fs").Stats;
    store?: boolean;
  }

  interface ZipArchiveOptions {
    comment?: string;
    forceLocalTime?: boolean;
    forceZip64?: boolean;
    highWaterMark?: number;
    namePrependSlash?: boolean;
    statConcurrency?: number;
    store?: boolean;
    zlib?: import("node:zlib").ZlibOptions;
  }

  export class ZipArchive extends Transform {
    constructor(options?: ZipArchiveOptions);
    append(source: Buffer | string | NodeJS.ReadableStream, data?: ZipEntryData): this;
    finalize(): Promise<void>;
  }
}
