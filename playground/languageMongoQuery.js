
db.barcodes.aggregate([

    { $match: { barcode: { "$in": ["9504113148440", "8680593044418", "9504113271513"] } } },
    {
        $lookup:
        {
            from: "languages",
            let: { b: "$barcode" },
            pipeline: [{
                "$match": {
                    "$expr":
                    {
                        "$and": [
                            { "$eq": ["$keyValue", "$$b"] },
                            { "$eq": ["pl", "$languageId"] }
                        ]
                    }
                }
            }],
            as: "languages"
        }
    },
    {
        "$project": {
            "languages._id": 0,
            "languages.refTableId": 0,
            "languages.itemId": 0,
            "languages.inventColorId": 0,
            "languages.configId": 0,
            "languages.rboStyleId": 0,
            "languages.inventDimId": 0,
            "languages.rboColorId": 0,
            "languages.itemGroupId": 0,
            "languages.countryRegionId": 0,
            "languages.themeId": 0,
            "languages.genderId": 0,
            "languages.fabricCompositionId": 0,
            "languages.fshDivisionGroupId": 0,
            "languages.dataAreaId": 0,
            "languages.labelTxt": 0,
            "languages.recId": 0,
            "languages.tableName": 0,
            "languages.keyValue": 0,
            "languages.createdAt": 0,
            "languages.__v": 0
        }
    }



])