import { ReactElement } from "react";

export type ProcessStepInfo = {
  type: "info";
  title: string;
};

export type ProcessStepRunnable = {
  type: "step";
  title: string;
  phase: "running" | "completed" | "failed" | "aborted";
  error?: unknown;
  progress?: string;
  output?: string;
};

export type ProcessStepConfirm = {
  type: "confirm";
  title: string;
  confirmed: boolean | undefined;
};

export type ProcessStepInput = {
  type: "input";
  title: string;
  mask?: boolean;
  value?: string;
};

export type ProcessStepSelect<TVal> = {
  type: "select";
  title: string;
  options: { value: TVal; label: string }[];
  selected?: TVal;
};

export type ProcessStep =
  | ProcessStepInfo
  | ProcessStepRunnable
  | ProcessStepConfirm
  | ProcessStepInput
  | ProcessStepSelect<unknown>;

export type CleanupFunction = {
  title: string;
  fn: () => Promise<unknown>;
};

export class RunnableHandler {
  private readonly listener: () => void;
  private readonly processStep: ProcessStepRunnable;

  private readonly promise: Promise<void>;
  private resolve: () => void = () => {};
  private reject: (err: unknown) => void = () => {};

  public constructor(state: ProcessStepRunnable, l: () => void) {
    this.processStep = state;
    this.listener = l;
    this.promise = new Promise<void>((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });

    this.promise.catch(() => {});
  }

  public get done(): boolean {
    return this.processStep.phase !== "running";
  }

  public wait(): Promise<void> {
    return this.promise;
  }

  public abort() {
    this.processStep.phase = "aborted";
    this.listener();
    this.resolve();
  }

  public complete() {
    this.processStep.phase = "completed";
    this.listener();
    this.resolve();
  }

  public progress(p: string) {
    this.processStep.progress = p;
    this.listener();
  }

  public appendOutput(o: string) {
    if (this.processStep.output === undefined) {
      this.processStep.output = "";
    }
    this.processStep.output += o;
    this.listener();
  }

  public error(err: unknown) {
    this.processStep.phase = "failed";
    this.processStep.error = err;
    this.listener();
    this.reject(err);
  }
}

export interface ProcessRenderer {
  start(): void;
  addStep(title: string): RunnableHandler;
  runStep<TRes>(
    title: string,
    fn: (() => Promise<TRes>) | Promise<TRes>,
  ): Promise<TRes>;
  addInfo(title: string): void;
  addConfirmation(question: string): Promise<boolean>;
  addInput(question: string, mask?: boolean): Promise<string>;
  addSelect<TVal>(
    question: string,
    options: { value: TVal; label: string }[],
  ): Promise<TVal>;
  addCleanup(title: string, fn: () => Promise<unknown>): void;

  complete(summary: ReactElement): Promise<void>;
  error(err: unknown): Promise<void>;
}
