import * as yaml from "js-yaml";
import { stdout } from "@oclif/core/ux";

export interface Printer<T> {
  log(content: T): void;
}

export class PrinterFactory {
  public static build<T = unknown>(
    outputFormat: string | undefined,
    defaultPrinter: Printer<T> = new YamlPrinter(),
  ): Printer<T> {
    switch (outputFormat) {
      case "yaml":
        return new YamlPrinter();

      case "json":
        return new JsonPrinter();

      default:
        return defaultPrinter;
    }
  }
}

export class YamlPrinter implements Printer<unknown> {
  public log(content: unknown): void {
    stdout(yaml.dump(content));
  }
}

export class JsonPrinter implements Printer<unknown> {
  public log(content: unknown): void {
    stdout(JSON.stringify(content, undefined, 2));
  }
}
