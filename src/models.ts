import { IntWayu, StringWayu, WayuModel } from '.'

WayuModel.generate('states', {
    size: new IntWayu(),
    state: new StringWayu(),
    stateId: new IntWayu({
        autoIncrement: true,
        notNull: true,
        primaryKey: true,
    }),
})

WayuModel.generate('cities', {
    city: new StringWayu(),
    cityId: new IntWayu({
        autoIncrement: true,
        notNull: true,
        primaryKey: true,
        unique: true,
    }),
})

export default WayuModel
