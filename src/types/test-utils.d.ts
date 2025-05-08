import { Mock as VitestMock } from "vitest";

declare global {
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Mock<TReturn = unknown, TArgs extends any[] = any[]> = VitestMock<
      TReturn,
      TArgs
    >;
  }
}

export {};
