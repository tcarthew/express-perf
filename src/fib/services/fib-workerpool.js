const { worker } = require ('workerpool');
const { fib } = './fib-service';

worker({
  fibo: fib
});