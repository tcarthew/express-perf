export const fib = (count: number): number => {
  console.log('A');
  if (count <= 1){
    return count;
  }

  return fib(count -1) + fib(count -2);
}