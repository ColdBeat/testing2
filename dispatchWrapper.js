const special = /^(.{7}S.{3}E.E|.{6}s.{2}e.e).{4}$/

class DispatchWrapper {
  constructor(base, moduleName) {
    this.base = base;
    this.moduleName = moduleName;
  }

  load(name, from, required = true, ...args) {
    const mod = this.base.load(name, from, ...args);
    if (required && !mod) {
      throw new Error(`Cannot find module '${name}'`);
    }
    return mod;
  }

  unload(...args) {
    return this.base.unload(...args);
  }

  hook(...args) {
    const hook = this.base.hook(...args);
    hook.moduleName = this.moduleName;
    return hook;
  }

  hookOnce(...args) {
    const cb = args.pop();
    if (typeof cb !== 'function') {
      throw new Error('last argument not a function');
    }

    const hook = this.base.hook(...args, (...hookArgs) => {
      this.base.unhook(hook);
      return cb(...hookArgs);
    });

    return hook;
  }

  unhook(...args) {
    return this.base.unhook(...args);
  }

  toClient(...args) {
    return this.base.write(false, ...args);
  }

  toServer(...args) {
    return this.base.write(!special.test(args[0]), ...args);
  }
}

module.exports = DispatchWrapper;
