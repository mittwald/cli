import React, { ReactElement, ReactNode } from "react";
import { ProcessRenderer, ProcessStep, RunnableHandler } from "./process.js";
import { Header } from "../react/components/Header.js";
import { Box, render, Text } from "ink";
import { ProcessState } from "./components/ProcessState.js";
import { ProcessConfirmation } from "./components/ProcessConfirmation.js";
import { ProcessInput } from "./components/ProcessInput.js";

export class FancyProcessRenderer implements ProcessRenderer {
  private readonly title: string;
  private started = false;
  private currentHandler: RunnableHandler | null = null;

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
      step.error(err);
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

  public complete(summary: ReactElement) {
    if (this.currentHandler) {
      this.currentHandler.complete();
    }

    render(
      <Box marginY={1} marginX={2}>
        {summary}
      </Box>,
    ).unmount();
  }

  public error(err: unknown): void {
    if (this.currentHandler) {
      this.currentHandler.error(err);
    } else {
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
}
