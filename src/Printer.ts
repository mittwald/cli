import * as yaml from "js-yaml";
import { stdout, ux } from "@oclif/core";

export interface Printer<T> {
  log(content: T): void;
}

export class PrinterFactory {
  public static build<T = unknown>(outputFormat: string | undefined, defaultPrinter: Printer<T> = new DefaultPrinter()): Printer<T> {
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

export class YamlPrinter implements Printer<any> {
  public log(content: any): void {
    stdout.write(yaml.dump(content));
  }
}

export class JsonPrinter implements Printer<any> {
  public log(content: any): void {
    ux.styledJSON(content);
  }
}

// csvn't

export class DefaultPrinter implements Printer<any> {
  public log(content: any): void {
    ux.styledObject(content);
  }
}
