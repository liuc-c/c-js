

import { Module } from "@clarity-types/core";
import measure from "@src/core/measure";
import * as statistics from "@src/statistics/index"

const modules: Module[] = [statistics];

export function start() {
   modules.forEach(x => measure(x.start)());
}