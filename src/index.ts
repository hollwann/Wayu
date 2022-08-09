abstract class WayuDataType {
    public primaryKey: boolean
    public notNull: boolean
    public unique: boolean
    public autoIncrement: boolean
    public defaultValue: string | null
    public length: number | null

    constructor({
        primaryKey = false,
        notNull = false,
        unique = false,
        autoIncrement = false,
        defaultValue = null,
        length = null,
    } = {}) {
        this.primaryKey = primaryKey
        this.notNull = notNull
        this.unique = unique
        this.autoIncrement = autoIncrement
        this.defaultValue = defaultValue
        this.length = length
    }

    public abstract getValue(): unknown
    getConfig() {
        return {
            autoIncrement: this.autoIncrement,
            defaultValue: this.defaultValue,
            length: this.length,
            notNull: this.notNull,
            primaryKey: this.primaryKey,
            unique: this.unique,
        }
    }


}

export class StringWayu extends WayuDataType {
    public type = 'string'
    public getValue(): string {
        return ''
    }
}

export class IntWayu extends WayuDataType {
    public type = 'int'
    public getValue(): number {
        return 0
    }
}

export class BooleanWayu extends WayuDataType {
    public type = 'boolean'
    public getValue(): boolean {
        return false
    }
}

export class WayuModelInstance<T extends DataTypesRecord> {
    public data: DataTypesValues<T>

    constructor(modelData: DataTypesValues<T>) {
        this.data = modelData
    }
}

export class WayuModelStatic<T extends DataTypesRecord> {
    public modelDataTypes: T
    public tableName: string

    constructor(modelDataTypes: T, tableName: string) {
        this.modelDataTypes = modelDataTypes
        this.tableName = tableName
    }

    public async getAll(): Promise<WayuModelInstance<T>[]> {
        return []
    }
    public getFormatedData(): {
        [x: string]: DataTypesRecord;
    } {
        return { [this.tableName]: this.modelDataTypes }
    }
}

export class WayuModel {
    public static instances: WayuModelStatic<DataTypesRecord>[] = []

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

// const States = WayuModel.generate('states', {
//     state: new StringWayu(),
//     stateId: new IntWayu({
//         autoIncrement: true,
//         notNull: true,
//         primaryKey: true,
//     }),
// })

// console.log(WayuModel.instances, States)
