declare type modelsDbMigrate = {
	driver: 'mysql',
	username: 'root',
	password: 'root',
	database: 'testdb'
}

declare module "*.json" {
	const value: Record<string, string | modelsDbMigrate>;
	export default value;
}