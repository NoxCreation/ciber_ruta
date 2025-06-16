import { sequelize } from "@/utils/engine";
import { DataTypes } from "sequelize";

export const UserModel = () => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        isRemove: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        },
        interface: {
            type: DataTypes.TEXT,
            defaultValue: '{viewId: 0,data: {}}'
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {});

    return User
}

