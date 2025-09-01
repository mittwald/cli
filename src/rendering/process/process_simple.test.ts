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

describe("SimpleProcessRenderer", () => {
  let consoleSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should start with a title", () => {
    const renderer = new SimpleProcessRenderer("Test Process");
    renderer.start();

    expect(consoleSpy).toHaveBeenCalledWith("Starting: Test Process");
  });

  it("should display info messages", () => {
    const renderer = new SimpleProcessRenderer("Test Process");
    renderer.addInfo("This is an info message");

    expect(consoleSpy).toHaveBeenCalledWith("[INFO] This is an info message");
  });

  it("should handle string step titles", () => {
    const renderer = new SimpleProcessRenderer("Test Process");
    const handler = renderer.addStep("Processing data");

    expect(consoleSpy).toHaveBeenCalledWith(
      "[RUNNING] Step 1: Processing data...",
    );

    handler.complete();
    expect(consoleSpy).toHaveBeenCalledWith(
      "[COMPLETED] Step 1: Processing data",
    );
  });

  it("should handle step failures", () => {
    const renderer = new SimpleProcessRenderer("Test Process");
    const handler = renderer.addStep("Failing step");

    handler.error("Something went wrong");

    expect(consoleSpy).toHaveBeenCalledWith("[FAILED] Step 1: Failing step");
    expect(consoleSpy).toHaveBeenCalledWith("  Error: Something went wrong");
  });

  it("should handle step progress", () => {
    const renderer = new SimpleProcessRenderer("Test Process");
    const handler = renderer.addStep("Long running task");

    handler.progress("50% complete");

    expect(consoleSpy).toHaveBeenCalledWith("  Progress: 50% complete");
  });

  it("should handle step output", () => {
    const renderer = new SimpleProcessRenderer("Test Process");
    const handler = renderer.addStep("Task with output");

    handler.appendOutput("Line 1\nLine 2\n");

    expect(consoleSpy).toHaveBeenCalledWith("  Line 1");
    expect(consoleSpy).toHaveBeenCalledWith("  Line 2");
  });

  it("should run steps successfully", async () => {
    const renderer = new SimpleProcessRenderer("Test Process");

    const result = await renderer.runStep("Test step", async () => {
      return "success";
    });

    expect(result).toBe("success");
    expect(consoleSpy).toHaveBeenCalledWith("[RUNNING] Step 1: Test step...");
    expect(consoleSpy).toHaveBeenCalledWith("[COMPLETED] Step 1: Test step");
  });

  it("should handle runStep failures", async () => {
    const renderer = new SimpleProcessRenderer("Test Process");

    await expect(
      renderer.runStep("Failing step", async () => {
        throw new Error("Test error");
      }),
    ).rejects.toThrow("Test error");

    expect(consoleSpy).toHaveBeenCalledWith("[FAILED] Step 1: Failing step");
  });

  it("should auto-confirm confirmations", async () => {
    const renderer = new SimpleProcessRenderer("Test Process");

    const result = await renderer.addConfirmation("Do you want to continue?");

    expect(result).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      "[CONFIRM] Do you want to continue?",
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "[CONFIRM] Automatically confirming: true",
    );
  });

  it("should throw error for input requests", async () => {
    const renderer = new SimpleProcessRenderer("Test Process");

    await expect(renderer.addInput("Enter your name")).rejects.toThrow(
      "Interactive input not available in simple process renderer",
    );
  });

  it("should throw error for select requests", async () => {
    const renderer = new SimpleProcessRenderer("Test Process");

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
    const renderer = new SimpleProcessRenderer("Test Process");
    const reactElement = React.createElement("span", null, "React step");

    renderer.addStep(reactElement);

    expect(consoleSpy).toHaveBeenCalledWith("[RUNNING] Step 1: React step...");
  });

  it("should complete with summary", async () => {
    const renderer = new SimpleProcessRenderer("Test Process");
    const summary = React.createElement("div", null, "Process completed!");

    await renderer.complete(summary);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[COMPLETED] Process completed successfully",
    );
    expect(consoleSpy).toHaveBeenCalledWith("Summary: Process completed!");
  });

  it("should handle errors", async () => {
    const renderer = new SimpleProcessRenderer("Test Process");

    await renderer.error("Something went wrong");

    expect(consoleSpy).toHaveBeenCalledWith(
      "[ERROR] Process failed: Something went wrong",
    );
  });

  it("should handle cleanup tasks", async () => {
    const renderer = new SimpleProcessRenderer("Test Process");
    const cleanupFn = jest.fn(async () => {});

    renderer.addCleanup("Cleanup task", cleanupFn);
    await renderer.complete(React.createElement("div", null, "Done"));

    expect(cleanupFn).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "[CLEANUP] Running cleanup tasks...",
    );
  });
});
