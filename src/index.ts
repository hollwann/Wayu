abstract class WayuDataType {
    public primaryKey: boolean
    public notNull: boolean
    public unique: boolean
    public autoIncrement: boolean
    public defaultValue: string | null

    constructor({
        primaryKey = false,
        notNull = false,
        unique = false,
        autoIncrement = false,
        defaultValue = null,
    } = {}) {
        this.primaryKey = primaryKey
        this.notNull = notNull
        this.unique = unique
        this.autoIncrement = autoIncrement
        this.defaultValue = defaultValue
    }

    public abstract getValue(): unknown
}

class StringWayu extends WayuDataType {
    public getValue(): string {
        return ''
    }
}

class IntWayu extends WayuDataType {
    public getValue(): number {
        return 0
    }
}

class BooleanWayu extends WayuDataType {
    public getValue(): boolean {
        return false
    }
}

class WayuModelInstance<T extends DataTypesRecord> {
    public data: DataTypesValues<T>

    constructor(modelData: DataTypesValues<T>) {
        this.data = modelData
    }
}

class WayuModelStatic<T extends DataTypesRecord> {
    public modelDataTypes: T
    public tableName: string

    constructor(modelDataTypes: T, tableName: string) {
        this.modelDataTypes = modelDataTypes
        this.tableName = tableName
    }

    public async getAll(): Promise<WayuModelInstance<T>[]> {
        return []
    }
}

class WayuModel {
    public static instances: WayuModelStatic<any>[]

    public static generate<T extends DataTypesRecord>(
        tableName: string,
        modelDataTypes: T
    ) {
        const modelStatic = new WayuModelStatic(modelDataTypes, tableName)
        WayuModel.instances.push(modelStatic)

        return modelStatic
    }
}

type DataTypesRecord = Record<string, IntWayu | StringWayu | BooleanWayu>

type DataTypesValues<T extends DataTypesRecord> = {
    [key in keyof T]: ReturnType<T[key]['getValue']>
}

const State = WayuModel.generate('states', {
    state: new StringWayu(),
    stateId: new IntWayu({
        autoIncrement: true,
        notNull: true,
        primaryKey: true,
    }),
})

console.log(WayuModel.instances, State)
