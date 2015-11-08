#!/usr/bin/env node
'use strict';

import gitblame   from 'git-blame';
import { JSHINT } from 'jshint';

import path  from 'path';
import chalk from 'chalk';
import _     from 'lodash';

import fs       from 'fs';
import { find } from './finder';
import yargs    from 'yargs';

var argv = yargs.argv;
var repoPath;
var startingDir;
var absoluteDir;
var file;

if (!argv.r) {
  // Basically, we have to change the working directory to the folder where the .git folder is.
  // Before we do that, we need to keep track of the original directory so we can resolve the file
  // location correctly later on!
  repoPath    = path.resolve(find('.git'));
  startingDir = process.cwd();
  absoluteDir = repoPath.replace('.git', '');
  process.chdir(absoluteDir);
} else {
  repoPath = path.resolve(argv.r);
}

if (!argv.f) {
  console.error(chalk.red('Filename not specified!'))
  process.exit(1);
}

file = startingDir.replace(absoluteDir, '') + '/' + argv.f;
var contents = fs.readFileSync(file, { encoding: 'utf-8' });

var currentCommitter;
var contributors = [];

JSHINT(contents, {
  node: true
});

var errors = JSHINT.errors.map((err) => {
  if (err) {
    return err.line.toString();
  }
});

gitblame(repoPath, {
  file: file,
  rev: 'HEAD'
}).on('data', (type, data) => {
  if (type === 'commit' && !_.isEmpty(data.author)) {

    var author = {
      name:    data.author.name,
      mail:    data.author.mail,
      commits: [],
      lines:   []
    };

    var existingCommitter = _.find(contributors, (cont) => {
      return cont.name == author.name && cont.mail == author.mail;
    });

    if (!existingCommitter) {
      author.commits.push(data.hash);
      contributors.push(author);
    } else {
      existingCommitter.commits.push(data.hash);
      currentCommitter = existingCommitter;
    }

  } else if (type === 'line' && currentCommitter) {
    currentCommitter.lines.push(data.finalLine);
  }

}).on('error', (err) => {
  console.log('oops');
  console.error(chalk.red(err.message));
}).on('end', () => {
  contributors.map((cont) => {
    cont.errors = 0;
    cont.lines.map((line) => {
      if (_.contains(errors, line)) {
        cont.errors +=1
      }
    });
    if (cont.errors != 0) {
      console.log(`Contributor ${cont.name} <${cont.mail}> made ${cont.errors} errors!`);
    }
  });
});
