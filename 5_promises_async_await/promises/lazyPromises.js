export class LazyPromise extends Promise {
  #resolve;
  #reject;
  #executor;
  #promise;

  constructor(executor) {
    let _resolve;
    let _reject;
    super((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    this.#resolve = _resolve;
    this.#reject = _reject;
    this.#executor = executor;
    this.#promise = null;
  }

  #ensureInit() {
    if (!this.#promise) {
      this.#promise = new Promise(this.#executor);
      //when this newly created promise executes the executor on the basis of that
      //then it's fullfillment or rejection value will fullfill or reject the LazyPromise instance
      //using it's prestored resolve and reject
      this.#promise.then(
        (v) => this.#resolve(v), //triggers on fullfilled of the LazyPromise instance
        (e) => this.#reject(e),
      );
    }
  }

  then(onFullFilled, onRejected) {
    this.#ensureInit();
    return this.#promise.then(onFullFilled, onRejected);
  }

  catch(onRejected) {
    this.#ensureInit();
    return this.#promise.catch(onRejected);
  }

  finally(onFinally) {
    this.#ensureInit();
    return this.#promise.finally(onFinally);
  }
}

const lazyPromise = new LazyPromise((resolve) => {
  console.log("Executor Started!");
  setTimeout(() => {
    resolve("Executor Finished.");
  }, 10000);
});

console.log("Lazy Promise instance created!");
console.log(lazyPromise);

console.log("we will start lazyPromise executor in a while.");

setTimeout(() => {
  lazyPromise.then((value) => {
    console.log(`seeing value in then: ${value}`);
    console.log(lazyPromise);
  });
}, 10000);
