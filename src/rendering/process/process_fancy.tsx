import React, { ReactElement, ReactNode } from "react";
import {
  CleanupFunction,
  ProcessRenderer,
  ProcessStep,
  ProcessStepSelect,
  RunnableHandler,
} from "./process.js";
import { Header } from "../react/components/Header.js";
import { Box, render, Text } from "ink";
import { ProcessState } from "./components/ProcessState.js";
import { ProcessConfirmation } from "./components/ProcessConfirmation.js";
import { ProcessInput } from "./components/ProcessInput.js";
import { ProcessSelect } from "./components/ProcessSelect.js";

export class FancyProcessRenderer implements ProcessRenderer {
  private readonly title: string;
  private started = false;
  private currentHandler: RunnableHandler | null = null;
  private cleanupFns: CleanupFunction[] = [];

  public constructor(title: string) {
    this.title = title;
  }

  public start() {
    if (this.started) {
      return;
    }

    this.started = true;
    render(this.renderStart(), {}).unmount();
  }

  public addStep(title: ReactNode): RunnableHandler {
    this.start();

    if (this.currentHandler !== null) {
      this.currentHandler.abort();
    }

    const state: ProcessStep = { type: "step", title, phase: "running" };
    const renderHandle = render(<ProcessState step={state} />);

    this.currentHandler = new RunnableHandler(state, () => {
      renderHandle.rerender(<ProcessState step={state} />);
      if (this.currentHandler?.done) {
        this.currentHandler = null;
        renderHandle.unmount();
      }
    });

    return this.currentHandler;
  }

  public async runStep<TRes>(
    title: ReactNode,
    fn: () => Promise<TRes>,
  ): Promise<TRes> {
    const step = this.addStep(title);
    try {
      const result = await fn();
      step.complete();
      return result;
    } catch (err) {
      await this.error(err);
      throw err;
    }
  }

  public addInfo(title: ReactElement) {
    this.start();

    if (this.currentHandler !== null) {
      this.currentHandler.complete();
    }

    const state: ProcessStep = { type: "info", title };
    render(<ProcessState step={state} />).unmount();
  }

  public addInput(
    question: React.ReactElement,
    mask?: boolean,
  ): Promise<string> {
    this.start();

    if (this.currentHandler !== null) {
      this.currentHandler.complete();
    }

    const state: ProcessStep = {
      type: "input",
      title: question,
      mask,
    };

    return new Promise<string>((res) => {
      const onInput = (value: string) => {
        res(value);
        state.value = value;
        if (renderHandle) {
          renderHandle.rerender(
            <ProcessInput step={state} onSubmit={onInput} />,
          );
          renderHandle.unmount();
        }
      };

      const renderHandle = render(
        <ProcessInput step={state} onSubmit={onInput} />,
      );
    });
  }

  public addSelect<TVal>(
    question: React.ReactNode,
    options: { value: TVal; label: React.ReactNode }[],
  ): Promise<TVal> {
    this.start();

    if (this.currentHandler !== null) {
      this.currentHandler.complete();
    }

    const state: ProcessStepSelect<TVal> = {
      type: "select",
      title: question,
      options,
      selected: undefined,
    };

    return new Promise<TVal>((res, rej) => {
      const onSelect = (selected: TVal) => {
        res(selected);
        state.selected = selected;
        if (renderHandle) {
          renderHandle.rerender(
            <ProcessSelect step={state} onSubmit={onSelect} />,
          );
          renderHandle.unmount();
        }
      };
      const onError = (err: unknown) => {
        if (renderHandle) {
          renderHandle.unmount();
        }
        rej(err);
      };

      const renderHandle = render(
        <ProcessSelect step={state} onSubmit={onSelect} onError={onError} />,
      );
    });
  }

  public addConfirmation(question: ReactElement): Promise<boolean> {
    this.start();

    if (this.currentHandler !== null) {
      this.currentHandler.complete();
    }

    const state: ProcessStep = {
      type: "confirm",
      title: question,
      confirmed: undefined,
    };

    return new Promise<boolean>((res) => {
      const onConfirm = (confirmed: boolean) => {
        res(confirmed);
        state.confirmed = confirmed;
        if (renderHandle) {
          renderHandle.rerender(
            <ProcessConfirmation step={state} onConfirm={onConfirm} />,
          );
          renderHandle.unmount();
        }
      };

      const renderHandle = render(
        <ProcessConfirmation step={state} onConfirm={onConfirm} />,
      );
    });
  }

  public async complete(summary: ReactElement) {
    if (this.currentHandler) {
      this.currentHandler.complete();
    }

    await this.cleanup();

    render(
      <Box marginY={1} marginX={2}>
        {summary}
      </Box>,
    ).unmount();
  }

  public async error(err: unknown): Promise<void> {
    if (this.currentHandler) {
      this.currentHandler.error(err);
      await this.cleanup();
    } else {
      await this.cleanup();
      render(
        <Box marginY={1} marginX={2} borderStyle="round" borderColor="red">
          <Text color="red">Error: {err?.toString()}</Text>
        </Box>,
      ).unmount();
    }
  }

  private renderStart(): React.ReactElement {
    return (
      <Box marginY={1} marginX={2}>
        <Header title={this.title} />
      </Box>
    );
  }

  public addCleanup(title: ReactNode, fn: () => Promise<unknown>): void {
    this.cleanupFns.push({ title, fn });
  }

  private async cleanup() {
    if (this.cleanupFns.length === 0) {
      return;
    }

    for (const { title, fn } of this.cleanupFns) {
      await this.runStep(title, async () => {
        await fn();
      });
    }
  }
}
