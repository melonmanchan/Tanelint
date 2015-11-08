'use strict';

import Table from 'tty-table';
import chalk from 'chalk';

const header = [ {
      value: 'Name',
      color: 'green',
      width: 20
    }, {
      value: 'Mail',
      color: 'green',
      width: 40
}, {
      value: 'Fuck-ups',
      color: 'red',
      width: 10,
      formatter: (value) => {
        if (value == 0) {
          return chalk.green(value);
        } else if (value <= 5) {
          return chalk.yellow(value);
        } else {
          return chalk.red(value);
        }
      }
    }
];

const options = {
  borderStyle:   1,
  paddingBottom: 0,
  headerAlign:   "center",
  align:         "center",
  color:         "white"
};

export function tablify(contributors) {
  let rows = contributors.map((cont) => {
    return {
      Name:       cont.name,
      Mail:       cont.mail,
      'Fuck-ups': cont.errors.toString()
    };
  });

  var t1 = Table(header, rows, options);

  return t1.render();

}
