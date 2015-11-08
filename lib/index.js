#!/usr/bin/env node
'use strict';

import gitblame   from 'git-blame';
import { JSHINT } from 'jshint';

import path  from 'path';
import chalk from 'chalk';
import _     from 'lodash';

import fs          from 'fs';
import { tablify } from  './tablify';
import { find }    from './finder';
import { die }     from './utils';
import yargs       from 'yargs';

var argv = yargs.argv;

var repoPath;
var configPath;

var startingDir;
var absoluteDir;
var file;

var hintOpts = {};

var currentCommitter;
var contributors = [];

// Handle custom repo location
if (!argv.r) {
  // Basically, we have to change the working directory to the folder where the .git folder is.
  // Before we do that, we need to keep track of the original directory so we can resolve the file
  // location correctly later on!
  repoPath = find('.git');
  if (!repoPath) {
    die('.git folder not found!')
  }
  console.log(`Using git directory found in ${repoPath}`)
} else {
  repoPath = path.resolve(argv.r);
}

// Handle JSHint configuration
if (argv.c) {
  configPath = argv.c;
} else {
  configPath = find('.jshintrc');
}

startingDir = process.cwd();
absoluteDir = repoPath.replace('.git', '');
process.chdir(absoluteDir);

// Handle file
if (argv.f) {
  file = argv.f;
}
// Allow us to simpy tanelint <FILE.js> without any flags
else if (process.argv.length == 3) {
  file = process.argv[2];
} else {
  die('Specify a filename with -f')
}


file = startingDir.replace(absoluteDir, '') + '/' + file;
var contents = fs.readFileSync(file, { encoding: 'utf-8' });

if (configPath) {
  console.log(`Using .jshintrc found in ${configPath}`);
  hintOpts = fs.readFileSync(configPath, { encoding: 'utf-8'})
}

JSHINT(contents, hintOpts);

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
  die(err.message);
}).on('end', () => {
  contributors.map((cont) => {
    cont.errors = 0;
    cont.lines.map((line) => {
      if (_.contains(errors, line)) {
        cont.errors += 1
      }
    });
  });

  contributors = _.sortBy(contributors, 'errors').reverse();
  console.log('The results are in... ');
  console.log(tablify(contributors));
});
