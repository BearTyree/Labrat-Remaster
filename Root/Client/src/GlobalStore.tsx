import { useEffect, useState } from 'react';

const createEmitter = () => {
  const subscriptions = new Map();

  return {
    emit: (v: any) => {
      subscriptions.forEach((fn) => fn(v));
    },
    subscribe: (fn: Function) => {
      const key = Symbol();
      subscriptions.set(key, fn);
      return () => {
        subscriptions.delete(key);
      };
    },
  };
};

const createStore = (init: Function) => {
  const emitter = createEmitter();

  let store: any = null;

  const get = () => store;

  const set = (op: Function) => {
    store = op(store);
    // console.log('store: ' + store.name);
    emitter.emit(store);
  };

  store = init(get, set);

  const useStore = () => {
    const [localStore, setLocalStore] = useState(get());

    useEffect(() => {
      emitter.subscribe(setLocalStore);
    }, []);

    return localStore;
  };

  return useStore;
};

let mainStore = createStore((get: Function, set: Function) => ({
  userType: '',
  setUserType: (op: Function) =>
    set((store: any) => ({
      ...store,
      userType: op(store.userType),
    })),
}));

let studentStore = createStore((get: Function, set: Function) => ({
  projects: [],
  setProjects: (op: Function) =>
    set((store: any) => ({
      ...store,
      projects: op(store.projects),
    })),
  setAll: (op: { projects?: Function }) =>
    set((store: any) => {
      const updatedProperties = Object.entries(op).reduce(
        (acc: { [key: string]: any }, [key, func]) => {
          acc[key] = func(store[key]);
          return acc;
        },
        {}
      );
      return {
        ...store,
        ...updatedProperties,
      };
    }),
  all: () =>
    Object.entries(get())
      .filter((v) => typeof v[1] != 'function')
      .reduce((accum: { [key: string]: any }, [k, v]) => {
        accum[k] = v;
        return accum;
      }, {}),
}));

export { mainStore, studentStore };
