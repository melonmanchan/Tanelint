'use strict';
import findUp from 'find-up';

export function find (name, start = process.cwd()) {
  let path = findUp.sync(name, {cwd: start});
  return path;
};
