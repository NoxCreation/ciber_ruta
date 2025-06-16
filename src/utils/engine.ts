import { UserModel } from "@/models/User";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE_NAME as string, process.env.DATABASE_USERNAME as string, process.env.DATABASE_PASSWORD as string, {
    dialect: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string),
    dialectOptions: {
        /* ssl: {
            require: false, // Si tu base de datos requiere SSL
            rejectUnauthorized: false // Si necesitas desactivar la verificación del certificado
        } */
    },
    logging: false,

}) as Sequelize;

let sync = false
export const Manager = () => {

    // Creando modelos
    const User = UserModel()

    // Si no esta sincronizado, se sincroniza la primera vez nada mas.
    if (!sync) {
        sync = true
        const sc = async () => {
            console.log("Sincronizando")
            await sequelize.sync()
            console.log('Base de datos y tablas creadas!')
        }
        sc()
    }

    return {
        User: new Model(User)
    }
}

/* const relateOneToMany = (model1: any, model2: any, model1as: string, model2as: string, foreignKey: string) => {
    model2.hasMany(model1, {
        foreignKey: foreignKey,
        as: model1as,
        onDelete: 'CASCADE'
    });
    model1.belongsTo(model2, {
        foreignKey: foreignKey,
        as: model2as,
        onDelete: 'CASCADE'
    });
} */

export class Model {
    model = null as any;
    query = null as any;

    constructor(model: any) {
        this.model = model;
    }

    async findAll(props?: any) {
        this.query = await this.model.findAll(props)
        return this
    }

    async findOne(props?: any, transaction?: any) {
        this.query = await this.model.findOne(props, transaction)
        return this
    }

    async findOneById(id: string, props?: any) {
        this.query = await this.model.findByPk(id, props)
        return this
    }

    async create(props: any, transaction?: any) {
        this.query = await this.model.create(props, transaction)
        return this
    }

    async upsert(props: any, transaction?: any) {
        this.query = await this.model.upsert(props, transaction)
        return this
    }

    async update(id: string, props: any, transaction?: any) {
        this.query = await this.model.update(props, { where: { id }, ...transaction })
        //this.query = await this.model.update(id, props, transaction)
        return this
    }

    async delete(id: string, transaction?: any) {
        this.query = await this.model.destroy({ where: { id }, ...transaction })
        return this
    }

    async count(where?: any) {
        return await this.model.count({ ...where })
    }

    toJSON() {
        return JSON.parse(JSON.stringify(this.query))
    }
}

export async function testConnection() {
    try {
        await sequelize.authenticate()
        console.log("Conexión establecida correctamente.")
        return true
    } catch (error) {
        console.error("No se pudo conectar a la base de datos:", error)
        return false
    }
}


export async function syncDatabase() {
    try {
        // Sincroniza todos los modelos
        // force: true -> DROP TABLES (¡Cuidado! Solo usar en desarrollo)
        // alter: true -> Altera las tablas existentes para que coincidan con los modelos
        Manager()
        await sequelize.sync({ alter: true });
        console.log("Base de datos sincronizada correctamente");
        return true;
    } catch (error) {
        console.error("Error al sincronizar la base de datos:", error);
        return false;
    }
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

