# Tanelint
> Git blame + JSHint in your command line.

## Install

```sh
$ npm install -g tanelint
```


## Usage

Navigate into your repository, and run tanelint -f <FILENAME.js>. Tanelint will look for a .git directory and a JSHint file recursively upwards.

```sh
tanelint lib/index.js => Contributor Matti Jokitulpppo made 19 errors!
```

![](http://i.imgur.com/ImphX41.png)

### Arguments
|  Flag  | Purpose |
| ------------- | ------------- |
| -f  | File to lint  |
| -r  | Git repository location  |
| -c  | JSHint config file location  |



## License

MIT © [Matti Jokitulppo](http://mattij.com)


[![npm version](https://badge.fury.io/js/tanelint.svg)](https://badge.fury.io/js/tanelint)
[![npm downloads](https://img.shields.io/npm/dm/tanelint.svg)](https://img.shields.io/npm/dm/tanelint.svg)

