import { Task } from 'fp-ts/lib/Task'

type Disposable = Task<void>

export type State = Task<Disposable | void>

export type StateManager = {
    enter(state: State): Promise<void>
}

export function stateManager(): StateManager {
    let current: Disposable | void

    const enter = async (state: State) => {
        await current?.()
        current = await state()
    }

    return {
        enter,
    }
}
