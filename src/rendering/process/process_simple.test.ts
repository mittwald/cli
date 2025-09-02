import { SimpleProcessRenderer } from "./process_simple.js";
import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import React from "react";
import { Writable } from "stream";

describe("SimpleProcessRenderer", () => {
  let output: string;
  let testStream: Writable;

  beforeEach(() => {
    output = "";
    testStream = new Writable({
      write(chunk, encoding, callback) {
        output += chunk.toString();
        if (callback) callback();
        return true;
      },
    });
  });

  it("should start with a title", () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);
    renderer.start();

    expect(output).toContain("Starting: Test Process\n");
  });

  it("should display info messages", () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);
    renderer.addInfo("This is an info message");

    expect(output).toContain("Info: This is an info message\n");
  });

  it("should handle string step titles", () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);
    const handler = renderer.addStep("Processing data");

    expect(output).toContain("Step 1: Processing data... ");

    handler.complete();
    expect(output).toContain("completed\n");
  });

  it("should handle step failures", () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);
    const handler = renderer.addStep("Failing step");

    handler.error("Something went wrong");

    expect(output).toContain("FAILED\n");
    expect(output).toContain("  Error: Something went wrong\n");
  });

  it("should handle step progress", () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);
    const handler = renderer.addStep("Long running task");

    handler.progress("50% complete");

    expect(output).toContain("  Progress: 50% complete\n");
  });

  it("should handle step output", () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);
    const handler = renderer.addStep("Task with output");

    handler.appendOutput("Line 1\nLine 2\n");

    expect(output).toContain("got output:\n");
    expect(output).toContain("  Line 1\n");
    expect(output).toContain("  Line 2\n");
  });

  it("should run steps successfully", async () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);

    const result = await renderer.runStep("Test step", async () => {
      return "success";
    });

    expect(result).toBe("success");
    expect(output).toContain("Step 1: Test step... ");
    expect(output).toContain("completed\n");
  });

  it("should handle runStep failures", async () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);

    await expect(
      renderer.runStep("Failing step", async () => {
        throw new Error("Test error");
      }),
    ).rejects.toThrow("Test error");

    expect(output).toContain("FAILED\n");
  });

  it("should auto-confirm confirmations", async () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);

    const result = await renderer.addConfirmation("Do you want to continue?");

    expect(result).toBe(true);
    expect(output).toContain(
      "Confirm: Do you want to continue?; automatically confirmed\n",
    );
  });

  it("should throw error for input requests", async () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);

    await expect(renderer.addInput("Enter your name")).rejects.toThrow(
      "Interactive input not available in simple process renderer",
    );
  });

  it("should throw error for select requests", async () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);

    await expect(
      renderer.addSelect("Choose option", [
        { value: "a", label: "Option A" },
        { value: "b", label: "Option B" },
      ]),
    ).rejects.toThrow(
      "Interactive selection not available in simple process renderer",
    );
  });

  it("should handle React element titles", () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);
    const reactElement = React.createElement("span", null, "React step");

    renderer.addStep(reactElement);

    expect(output).toContain("Step 1: React step... ");
  });

  it("should complete with summary", async () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);
    const summary = React.createElement("div", null, "Process completed!");

    await renderer.complete(summary);

    expect(output).toContain("Completed: Process completed successfully\n\n");
    expect(output).toContain("Summary: Process completed!\n");
  });

  it("should handle errors", async () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);

    await renderer.error("Something went wrong");

    expect(output).toContain("ERROR: Process failed: Something went wrong\n");
  });

  it("should handle cleanup tasks", async () => {
    const renderer = new SimpleProcessRenderer("Test Process", testStream);
    const cleanupFn = jest.fn(async () => {});

    renderer.addCleanup("Cleanup task", cleanupFn);
    await renderer.complete(React.createElement("div", null, "Done"));

    expect(cleanupFn).toHaveBeenCalled();
    expect(output).toContain("Cleanup: Running cleanup tasks... ");
  });
});
