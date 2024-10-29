type LazyAsync<T> = () => Promise<T>;

type Disposable = LazyAsync<void>;

export type State = LazyAsync<Disposable | void>;

export type StateManager = {
  enter(state: State): Promise<void>;
};

export function stateManager(): StateManager {
  let current: Disposable | void;

  const enter = async (state: State) => {
    await current?.();
    current = await state();
  };

  return {
    enter,
  };
}
