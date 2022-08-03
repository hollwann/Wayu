import { IntWayu, StringWayu, WayuModel } from '.'


WayuModel.generate('states', {
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
	}),
})

export default WayuModel

