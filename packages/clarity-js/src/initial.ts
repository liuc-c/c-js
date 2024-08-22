import { Config } from "@clarity-types/core";
import * as data from "@src/data";
import * as core from "@src/core";
import * as queue from "@src/queue";

export function start(config: Config = null): void {
      core.config(config);
      core.start();
      data.start();
      if (config === null) { queue.process(); }
  }