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
  console.error(chalk.red(err.message));
}).on('end', () => {
  contributors.map((cont) => {
    cont.errors = 0;
    cont.lines.map((line) => {
      if (_.contains(errors, line)) {
        cont.errors +=1
      }
    });
    console.log(`Contributor ${cont.name} made ${cont.errors} errors!`);
  });
});
