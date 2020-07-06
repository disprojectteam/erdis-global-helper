const { DbConfig } = require('../models/dbConfig');
const dbConfings=[
{
    "configName" : "Colins_MA",
    "description" : "Colins Romanya Ax2009 Prod Db",
    "server" : "192.168.0.13",
    "user" : "ax",
    "password" : "465666",
    "database" : "CL_Other_Retail_Live",
    "__v" : 0
},
{
    "configName" : "Colins_TR",
    "description" : "Colins Ax2012 Prod Db",
    "server" : "SERVERTR149",
    "user" : "erdis",
    "password" : "erdis123",
    "database" : "AX2012R3CU10PROD",
    "__v" : 0
},
{
    "configName" : "Colins_TR_ReadOnly",
    "description" : "Colins Ax2012 Prod Db Readonly",
    "server" : "SERVERTR149",
    "user" : "erdis",
    "password" : "erdis123",
    "database" : "AX2012R3CU10PROD",
    "__v" : 0
},
{  
    "configName" : "Colins_BL",
    "server" : "192.168.0.13",
    "user" : "ax",
    "password" : "465666",
    "database" : "CL_Other_Retail_Live",
    "description" : "Colins Belarus Ax 2009 Prod Db",
    "__v" : 0
},
{
    "configName" : "Colins_MA_Dev",
    "server" : "192.168.0.13",
    "user" : "ax",
    "password" : "465666",
    "database" : "CL_Other_Retail_Test",
    "description" : "Colins Morocco Ax 2009 Dev Db",
    "__v" : 0
}]
const func=()=>{
    dbConfings.forEach(async (element) => {
        await new DbConfig(element).save()
    });
}

func();