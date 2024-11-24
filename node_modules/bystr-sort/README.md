[![Build Status](https://app.travis-ci.com/ManuUseGitHub/bystr-sort.svg?branch=master)](https://app.travis-ci.com/ManuUseGitHub/sorter) [![npm version](https://badge.fury.io/js/bystr-sort.svg)](https://badge.fury.io/js/bystr-sort)
# ByStr~Sort
Does sort your arrays of `T object` following a verbose `sortString` 🙂 .

----------------------------------------------------------------
## Getting started 🚀
1. install it
    ```cmd
    $ npm install -D bystr-sort
    ```
    and require it 
    ```js
    const { sort } = require( "bystr-sort" );
    ```
1. define a sort string:
   Assuming you have an array of `T` object like this:
   ```js
   const greetings : T[] = [ 
       { order:14 , greet:"Hello" ,        level:"medium" ,   lang:"en" },
       { order:3 ,  greet:"yo" ,           level:"familiar" , lang:"fr" },
       { order:5 ,  greet:"selamat pagi" , level:"medium" ,   lang:"id" }
   ];
   ```
   A valid sort string could be
   ```js
   const sortString = `
        by greet of a greater than b's then
        by level of a < than b's
   `;
   ```
1. sort your `T[]` :
   ```js
   const sorted : T[] = sort( greetings , sortString );
   ```

### Sortstring
- it is a string used to sort your array of `T` objects. 
- It gives you the ability to set multiple sorts by using the `then` keyword at the end of a sort sentence. **a sort sentence** is matches this regex pattern
  ```regex
  by {colA|colB|colC|...|colN} of a[|b] lower[|greater,<,>] than b[|a]'s [then]
  ```
- The `by` keyword starts the sentence and `a's` or `b's` ends it. **Then is used to chain** the next sort sentence
- To invert the sort direction, you can play with keywords `lower, greater, >, <` but also with `a, b` order in the sentence. So: `by ... b ... > ... a's` is also valid. Because why not ?

Note
- further updates will allow the case insensitiveness of the whole sort sentence ...

----------------------------------------------------------------
## Bonus 🎈
there is a littel more ...
### parameters
Assuming the signature for sort is like the following:
```js
const sort = (
    objectArray: any[] ,
    sortString = "" ,
    crashOnError = false ,
    logfn = console.error
): any[]
```
- **crashOnError**
  - When set to ***true*** : 
  It gives you the abbility to throw an exception when your sort string is invalid. You will be prompted with hints to fix your problem.

  - When set to ***false*** :
  It will prompt the error in the console.

- **logfn**
  Use this to check errors within your tests.
