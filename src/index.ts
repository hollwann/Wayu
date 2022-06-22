

class StringWayu  {
    getValue(): string {
        return ''
    }
}

class IntWayu{
    public instances: number = 0

    constructor() {
        this.instances++
    }

    getValue(): number {
        return 0
    }
}

const wayuModel = <T extends Record<string, IntWayu | StringWayu>>(tableName:string, data: T) => {
    type DataTypes = { [key in keyof T]: ReturnType<T[key]['getValue']> }

    class ModelGenerator {

        constructor(modelData: DataTypes) {
           for (const key in data) {
               this[key] = data[key]
           }
        }

        public static getAll(): Promise<ModelGenerator[]>{

        }
    }

    return ModelGenerator
}

const State = wayuModel('states',{
    state: new StringWayu(),
    stateId: new IntWayu(),
})

const states = await State.getAll()

states[0].
