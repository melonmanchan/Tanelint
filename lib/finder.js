'use strict';
import findUp from 'find-up';
import path   from 'path';

export function find (name, start = process.cwd()) {
  let foundFilePath = findUp.sync(name, {cwd: start});
  if (foundFilePath) { return path.resolve(foundFilePath)}
  else return null;
};
