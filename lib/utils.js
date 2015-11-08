'use strict';

import chalk from 'chalk';

export function die(reason = 'Unknown error') {
  console.error(chalk.red(`Error! ${reason}. Exiting...`));
  process.exit(1);
}


