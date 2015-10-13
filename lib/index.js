import gitblame from  'git-blame';
import path from      'path';
import chalk from     'chalk';
import stringify from 'stringify-object';

var repoPath = path.resolve(process.env.REPO || (__dirname + './git'));
var file     = process.env.FILE || 'gulpfile.js';


gitblame(repoPath, {
  file: file,
  rev: 'HEAD'
}).on('data', (type, data) => {
  console.log(chalk.green(type), chalk.magenta(stringify(data)));
}).on('error', (err) => {
  console.error(chalk.red(err.message));
});
