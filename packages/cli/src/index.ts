#!/usr/bin/env node
import { run } from './cli';

run().catch((error: Error) => {
  console.error(`\nError: ${error.message}`);
  process.exit(1);
});
