import React, { ReactElement, useState } from "react";
import { ProcessRenderer, ProcessStep, RunnableHandler } from "./process.js";
import { Header } from "./components/Header.js";
import { Box, render, Text, useInput } from "ink";
import * as readline from "readline";

export class FancyProcessRenderer implements ProcessRenderer {
  private title: string;
  private started: boolean = false;
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

  public addStep(title: ReactElement): RunnableHandler {
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

  public addInfo(title: ReactElement) {
    this.start();

    if (this.currentHandler !== null) {
      this.currentHandler.complete();
    }

    const state: ProcessStep = { type: "info", title };
    render(<ProcessState step={state} />).unmount();
  }

  public addConfirmation(question: ReactElement): Promise<boolean> {
    this.start();

    if (this.currentHandler !== null) {
      this.currentHandler.complete();
    }

    const state: ProcessStep = { type: "confirm", title: question, confirmed: undefined };

    return new Promise<boolean>((res, rej) => {
      let renderHandle: ReturnType<typeof render>;
      const onConfirm = (confirmed: boolean) => {
        res(confirmed);
        state.confirmed = confirmed;
        if (renderHandle) {
          renderHandle.rerender(<ProcessConfirmation step={state} onConfirm={onConfirm} />);
          renderHandle.unmount();
        }
      }

      renderHandle = render(<ProcessConfirmation step={state} onConfirm={onConfirm} />);
    });
  }

  public complete(summary: ReactElement) {
    render(
      <Box marginY={1} marginX={2}>
        {summary}
      </Box>,
    ).unmount();
  }

  private renderStart(): React.ReactElement {
    return (
      <Box marginY={1} marginX={2}>
        <Header title={this.title} />
      </Box>
    );
  }
}

const ProcessStateIcon: React.FC<{ step: ProcessStep }> = ({ step }) => {
  if (step.type === "info") {
    return <Text>ℹ️  </Text>;
  } else if (step.type === "confirm") {
    return <Text>❓</Text>;
  } else if (step.phase === "completed") {
    return <Text>✅</Text>;
  } else if (step.phase === "aborted") {
    return <Text>⏩️ </Text>;
  } else if (step.phase === "failed") {
    return <Text>❌ </Text>;
  } else {
    return <Text>🔁 </Text>;
  }
};

const ProcessStateSummary: React.FC<{ step: ProcessStep }> = ({ step }) => {
  if (step.type === "info") {
    return <Text></Text>;
  } else if (step.type === "confirm") {
    if (step.confirmed) {
      return <Text color="green"> confirmed</Text>;
    } else if (step.confirmed === false) {
      return <Text color="yellow"> not confirmed</Text>;
    } else {
      return <>
        <Text>: press </Text>
        <Text color="blue">y</Text>
        <Text> or </Text>
        <Text color="blue">n</Text>
        <Text color="gray"> (use the --force or --quiet flags to disable this prompt)</Text>
      </>;
    }
  } else if (step.phase === "completed") {
    return (
      <>
        <Text>. </Text>
        <Text color="green">done</Text>
      </>
    );
  } else if (step.phase === "aborted") {
    return (
      <>
        <Text>. </Text>
        <Text color="yellow">cancelled</Text>
      </>
    );
  } else if (step.phase === "failed") {
    return (
      <>
        <Text>. </Text>
        <Text color="error">ERROR</Text>
      </>
    );
  } else {
    return <Text>...</Text>;
  }
};

export const ProcessState: React.FC<{ step: ProcessStep }> = ({ step }) => {
  return (
    <Box marginX={2}>
      <ProcessStateIcon step={step} />
      <Text>{step.title}</Text>
      <ProcessStateSummary step={step} />
    </Box>
  );
};

export const ProcessConfirmation: React.FC<{ step: ProcessStep, onConfirm: (confirmed: boolean) => any}> = ({ step, onConfirm }) => {
  const [confirmed, setConfirmed] = useState<boolean | undefined>(undefined);
  useInput((input, key) => {
    if (input === "y") {
      setConfirmed(true);
      onConfirm(true);
    } else {
      setConfirmed(false);
      onConfirm(false);
    }
  });

  return <ProcessState step={step} />;
}
