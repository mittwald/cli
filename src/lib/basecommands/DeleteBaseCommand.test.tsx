import { beforeEach, describe, expect, it, jest } from "@jest/globals";

/*
 * Regression test for the bug where a failing deletion (e.g. an app uninstall
 * rejected with HTTP 412) still printed "Process completed successfully" and
 * exited with code 0. The command must instead surface the error via
 * process.error() and exit with a non-zero code.
 */

const fakeStep = {
  complete: jest.fn(),
  error: jest.fn(),
};

const fakeProcess = {
  start: jest.fn(),
  addStep: jest.fn(() => fakeStep),
  addConfirmation: jest.fn(async () => true),
  addInfo: jest.fn(),
  complete: jest.fn(async (_summary: unknown) => {}),
  error: jest.fn(async (_err: unknown) => {}),
};

const makeProcessRenderer = jest.fn(() => fakeProcess);

jest.unstable_mockModule("../../rendering/process/process_flags.js", () => ({
  __esModule: true,
  makeProcessRenderer,
  processFlags: {},
}));

const { DeleteBaseCommand } = await import("./DeleteBaseCommand.js");

class TestDelete extends DeleteBaseCommand<typeof TestDelete> {
  static resourceName = "test resource";
  public shouldThrow: unknown = undefined;

  protected async deleteResource(): Promise<void> {
    if (this.shouldThrow !== undefined) {
      throw this.shouldThrow;
    }
  }
}

function makeInstance(): TestDelete {
  const instance = Object.create(TestDelete.prototype) as TestDelete;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (instance as any).flags = { force: true };
  return instance;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function runExec(instance: TestDelete): Promise<any> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (instance as any).exec();
    return undefined;
  } catch (err) {
    return err;
  }
}

describe("DeleteBaseCommand", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reports success and does not exit non-zero when deletion succeeds", async () => {
    const instance = makeInstance();

    const thrown = await runExec(instance);

    expect(fakeStep.complete).toHaveBeenCalled();
    expect(fakeProcess.complete).toHaveBeenCalledTimes(1);
    expect(fakeProcess.error).not.toHaveBeenCalled();
    // no ux.exit() -> no thrown ExitError
    expect(thrown).toBeUndefined();
  });

  it("surfaces the error and exits non-zero when deletion fails", async () => {
    const instance = makeInstance();
    const failure = new Error("boom");
    instance.shouldThrow = failure;

    const thrown = await runExec(instance);

    // Must NOT falsely report success ...
    expect(fakeProcess.complete).not.toHaveBeenCalled();
    // ... must surface the actual error ...
    expect(fakeStep.error).toHaveBeenCalledWith(failure);
    expect(fakeProcess.error).toHaveBeenCalledWith(failure);
    // ... and must exit with a non-zero code (ux.exit(1) throws an ExitError).
    expect(thrown).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((thrown as any).oclif?.exit).toBe(1);
  });
});
