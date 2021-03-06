const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our user model
class User extends Model {
    // set up method to run on instance data to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table columns and configuration
User.init(
    {
        // define an id column
        id: {
            // use the special sequelize datatypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            //this is the equivalent of sql not null option
            allowNull: false,
            // instruct that this is the primary key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values
            unique: true,
            // if allownull is false, we can run data through validator
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            // set up beforecreate lifecycle
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
                },
                // set up beforeupdate lifecycle
                async beforeUpdate(updatedUserData) {
                    updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                    return updatedUserData;
                }
        },
        // pass in our imported sequelize connection
        sequelize,
        // dont automatically create createdAt/updatedAt timestamps
        timestamps: false,
        // dont pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing
        underscored: true,
        // make it so our model stays lowercase
        modelName: 'user'
    }
);

module.exports = User;