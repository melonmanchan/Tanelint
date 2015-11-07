#!/usr/bin/env node
'use strict';

import gitblame   from 'git-blame';
import { JSHINT } from 'jshint';

import path from      'path';
import chalk from     'chalk';
import stringify from 'stringify-object';
import _ from         'lodash';

import fs from    'fs'
import yargs from 'yargs';

var argv = yargs.argv;

var repoPath = path.resolve(argv.r || (process.cwd() + '/.git'));
var file     = argv.f || 'gulpfile.js';
var contents = fs.readFileSync(file, { encoding: 'utf-8' });

var contributors = [];

JSHINT(contents, {
  node: true
});

var errors = JSHINT.errors.map((err) => {
  return {
    line:   err.line,
    reason: err.reason};
});

gitblame(repoPath, {
  file: file,
  rev: 'HEAD'
}).on('data', (type, data) => {
  if (type === 'commit' && !_.isEmpty(data.author)) {

    var author = {
      name:    data.author.name,
      mail:    data.author.mail,
      commits: []
    };

    var addedAlready = false;
    contributors.map((cont) => {
      if (cont.name == author.name && cont.mail == author.mail) {
        addedAlready = true;
        cont.commits.push(data.hash);
      }
    });

    if (!addedAlready) {
      author.commits.push(data.hash);
      contributors.push(author);
    }

  } else if (type === 'line') {

  }
}).on('error', (err) => {
  console.error(chalk.red(err.message));
}).on('end', () => {
  console.log(contributors)
});
