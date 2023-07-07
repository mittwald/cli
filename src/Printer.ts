import * as yaml from "js-yaml";
import { ux, stdout } from "@oclif/core";

interface Printer {
  log(content: unknown): void;
}

export class PrinterFactory {
  public static build(outputFormat: string | undefined): Printer {
    switch (outputFormat) {
      case "yaml":
        return new YamlPrinter();

      case "json":
        return new JsonPrinter();

      default:
        return new DefaultPrinter();
    }
  }
}

export class YamlPrinter implements Printer {
  public log(content: unknown): void {
    stdout.write(yaml.dump(content));
  }
}

export class JsonPrinter implements Printer {
  public log(content: unknown): void {
    ux.styledJSON(content);
  }
}

// csvn't

export class DefaultPrinter implements Printer {
  public log(content: unknown): void {
    ux.styledObject(content);
  }
}
