import { FlagInput } from "@oclif/core/lib/interfaces/parser.js";
import { InferredFlags } from "@oclif/core/lib/interfaces/index.js";
import { Class } from "type-fest";
import { mergeObjects } from "../../lib/mergeObjects.js";

export type InferredOutput<T> = T extends Class<
  FlagSupportedSetup<FlagInput, any, infer TOut>, // eslint-disable-line
  any // eslint-disable-line
>
  ? TOut
  : never;

export abstract class FlagSupportedSetup<
  TFlags extends FlagInput,
  TSettings,
  TSetupObject,
> {
  public flags: TFlags;
  public settings: TSettings;

  protected constructor(flagsInput: TFlags, settings: TSettings) {
    this.flags = flagsInput;
    this.settings = settings;
  }

  public getSetup(flags: InferredFlags<TFlags>): TSettings & TSetupObject {
    return mergeObjects(this.settings, this.getFlagsOutput(flags));
  }

  protected abstract getFlagsOutput(flags: InferredFlags<TFlags>): TSetupObject;

  public static build = <TFlags extends FlagInput, TSettings, TOutput>(
    flags: TFlags,
    defaultSettings: TSettings,
    buildFlagsOutput: (
      flags: InferredFlags<TFlags>,
      settings: TSettings,
    ) => TOutput,
  ): Class<
    FlagSupportedSetup<TFlags, TSettings, TOutput>,
    [Partial<TSettings>] | []
  > => {
    return class ConcreteRenderSetup extends FlagSupportedSetup<
      TFlags,
      TSettings,
      TOutput
    > {
      public constructor(settings?: Partial<TSettings>) {
        super(flags, mergeObjects(defaultSettings, settings ?? {}));
      }

      protected getFlagsOutput(flags: InferredFlags<TFlags>): TOutput {
        return buildFlagsOutput(flags, this.settings);
      }
    };
  };
}
