#!/usr/bin/env node

import oclif from "@oclif/core";
import { handleError } from "../dist/lib/handleError.js";

oclif
  .run(process.argv.slice(2), import.meta.url)
  .then(oclif.flush)
  .catch(handleError);
