import gitblame from  'git-blame';
import path from      'path';
import chalk from     'chalk';
import stringify from 'stringify-object';

import yargs from 'yargs';

var argv = yargs.argv;

var repoPath = path.resolve(argv.r || (process.cwd() + '/.git'));
var file     = argv.f || 'gulpfile.js';
console.log(argv);

gitblame(repoPath, {
  file: file,
  rev: 'HEAD'
}).on('data', (type, data) => {
  console.log(chalk.green(type), chalk.magenta(stringify(data)));
}).on('error', (err) => {
  console.error(chalk.red(err.message));
});
