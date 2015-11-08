# Tanelint
> Git blame + JSHint in your command line.

## Install

```sh
$ npm install -g tanelint
```


## Usage

Navigate into your repository, and run tanelint -f <FILENAME.js>. Tanelint will look for a .git directory and a JSHint file recursively upwards.

```sh
tanelint -f lib/index.js => Contributor Matti Jokitulpppo made 19 errors!
```

![](http://i.imgur.com/ImphX41.png)

## License

MIT © [Matti Jokitulppo](http://mattij.com)


[npm-url]: https://npmjs.org/package/tanelint
