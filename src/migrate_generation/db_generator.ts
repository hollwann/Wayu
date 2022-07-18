declare type SQLType = 'varchar' | 'int' | 'tinyint' | 'timestamp'

interface INewField {
    type: SQLType
    unsigned: boolean
    notNull: boolean
    primaryKey: boolean
    autoIncrement: boolean
    length: number | undefined
}

class NewField implements INewField {
    type: SQLType
    unsigned = false
    notNull = false
    primaryKey: boolean
    autoIncrement: boolean
    length: number | undefined

    constructor(type: SQLType, primaryKey = false, autoIncrement = false) {
        this.type = type
        this.primaryKey = primaryKey
        this.autoIncrement = autoIncrement
    }
}
