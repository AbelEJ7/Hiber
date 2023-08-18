import { DataTypes } from "sequelize";
import sequelize from '../../connection/database.js';

    const GenBid = sequelize.define('Bid', {
        bid_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        prop_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cat_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bid_price: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        bid_file: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bid_upload_date: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bid_title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tender_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        deadline_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        financial_open_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        publish: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        tech_visibility: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        financial_visiblity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        bid_done: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        },
        {
            tableName: 'bid',
            timestamps: false,
        }
    );

  export default GenBid;