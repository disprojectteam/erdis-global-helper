
class connectionManager {

    async getConnectionString(_confName, _poolTimeout = 1999999, _connectionTimeout = 18090000, _requestTimeout = 29999999) {
        const DbConfig  = require('../models/dbConfig');
        const resString = await DbConfig.find({ configName: _confName });
        const result = resString[0];
        const cString = {
            server: result.server,
            user: result.user,
            password: result.password,
            database: result.database,
            connectionString: "Driver={SQL Server Native Client 11.0};Server=#{server}\\sql;Database=#{database};Uid=#{user};Pwd=#{password}",
            PoolTimeout: _poolTimeout, //3.3 min
            connectionTimeout: _connectionTimeout,// 10 min
            requestTimeout: _requestTimeout, //50 min
            options: {
                trustedConnection: true,
                encrypt: false
            },
            pool: {
                max: 1,
                min: 0,
                idleTimeoutMillis: 30000
            }
        }

        return cString;
    }

    async updateConnectionString(_confName, _server, _user, _password, _database, _description) {
        const { DbConfig } = require('../models/dbConfig');
        const resString = await DbConfig.find({ configName: _confName });
        const result = resString[0];
        try {
            if (result._id)
            {
                await DbConfig.findOneAndUpdate({ configName: _confName },
                    {
                        $set:
                        {
                            description: _description ? _description : result.description,
                            server: _server ? _server : result.server,
                            user: _user ? _user : result.user,
                            password: _password ? _password : result.password,
                            database: _database ? _database : result.database
                        }
                    });
                this.setConnectionString(_confName);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    async insertConnectionString(_confName, _server, _user, _password, _database, _description){
        const { DbConfig } = require('../models/dbConfig');
        await new DbConfig({
            configName: _confName,      //'Colins_RO',
            server: _server,            //"192.168.0.13",
            user: _user,                //"ax",
            password: _password,        //"465666",
            database: _database,        //'CL_Other_Retail_Live',
            description: _description   //'Colins Romanya Ax2009 Prod Db'
        }).save();
    }

    checkConnectionString(_confName) {
        if (_confName == "Colins_TR_ReadOnly")
            return global.conStr_CL_TR_ReadOnly  ? true : false;
        else if (_confName == "Colins_TR")
            return global.conStr_CL_TR ? true : false;
        else if (_confName == "Colins_UA")
            return global.conStr_CL_MA ? true : false;
        else if (_confName == "Colins_RO")
            return global.conStr_CL_RO ? true : false; 
        else if (_confName == "Colins_MA")
            return global.conStr_CL_MA ? true : false;
    }

    async setConnectionString(_confName) {
        if (_confName == "Colins_TR_ReadOnly")
            global.conStr_CL_TR_ReadOnly = await this.getConnectionString(_confName);
        else if (_confName == "Colins_TR")
            global.conStr_CL_TR = await this.getConnectionString(_confName);  
        else if (_confName == "Colins_UA")
            global.conStr_CL_MA = await this.getConnectionString(_confName);
        else if (_confName == "Colins_RO")
            global.conStr_CL_RO = await this.getConnectionString(_confName);
        else if (_confName == "Colins_MA")
            global.conStr_CL_MA = await this.getConnectionString(_confName);

    }

    async initializeConnectionString() {
        const DbConfig = require('../models/dbConfig');
        const result = await DbConfig.find({ });
        for (var i = 0, len = result.length; i < len; i++)
        {
            var data = result[i];
            if (data.configName == "Colins_TR_ReadOnly")
                global.conStr_CL_TR_ReadOnly = await this.getConnectionString(data.configName);
            else if (data.configName == "Colins_TR")
                global.conStr_CL_TR = await this.getConnectionString(data.configName);  
            else if (data.configName == "Colins_UA")
                global.conStr_CL_MA = await this.getConnectionString(data.configName);
            else if (data.configName == "Colins_RO")
                global.conStr_CL_RO = await this.getConnectionString(data.configName);
            else if (data.configName == "Colins_MA")
                global.conStr_CL_MA = await this.getConnectionString(data.configName);
        }
        
    }
}

var ConnectionManager = new connectionManager();
module.exports = ConnectionManager;