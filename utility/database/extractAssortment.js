
const  ShippingReceipt = require('../models/shippingReceipt');
const ErrorLog  = require('../../../helpers/errorLog');
const _ = require('lodash');
const request = require('request-promise');
var xl = require('excel4node');


//Assorti barkodların içlerini middlewaredan alır ve Assorti barkod sayısı kadar qtysini arttır.
async function extractAssortment(_id, sp) {
    try {
        var allBarcodes = [];

        for (var i = 0, len = sp.boxHeader.length; i < len; i++) {
            allBarcodes = _.concat(allBarcodes, _.map(sp.boxHeader[i].boxDetails, x=> _.pick(x, ['barcode', 'qty'])));
        }
        var aBarcodes = _.filter(allBarcodes, function (d) { return d.barcode.startsWith('A'); })
        if (aBarcodes.length > 0) {
            aBarcodes = _.uniq(aBarcodes);
            var aBarcodesDetails = await getBarcodes(aBarcodes.map(function (data) { return data.barcode; }));
            for (var j = 0; j < aBarcodes.length; j++) {
                let a = _.filter(aBarcodesDetails, function (d) { return d.barcode == aBarcodes[j].barcode; })
                let b = _.map(a[0].assormentBarcodeLines, x=> _.pick(x, ['barcode', 'qty']));
                allBarcodes = _.concat(allBarcodes,
                    _.map(b, function (data) {
                        data.qty = data.qty * aBarcodes[j].qty
                        return data
                            ;
                    }));
            }
            allBarcodes = _.filter(allBarcodes, function (d) { return !d.barcode.startsWith('A'); })
        }
        allBarcodes = await _(allBarcodes)
            .groupBy('barcode')
            .map((objs, key) => ({
                'barcode': key,
                'qty': _.sumBy(objs, 'qty')
            }))
            .value()
        return allBarcodes;

    } catch (err) {
        (async () => {
            await ShippingReceipt.findByIdAndUpdate(_id, { status: ShippingReceipt.Status.I });
            ErrorLog.add(err, _id, __filename)
        })();
    }


}

//middlewaredan barkodları alan fonksiyon
async function getBarcodes(_dataValues) {
    const options = {
        timeout: 600000,
        //url: `http://${process.env.Erdis_Middleware_URL}/api/barcode/byBarcodes`,
        url: `http://erdis.eroglu.com:3001/api/barcode/byBarcodes`,
        json: true,
        resolveWithFullResponse: true,
        method: 'Post',
        body: _dataValues,
        gzip: true,
    };
    try {
        const response = await request(options);
        return Promise.resolve(_.map(response.body.result, x=> _.pick(x, ["barcode", "assormentBarcodeLines"])));
    }
    catch (error) {
        Promise.reject(error);
    }
}

/*Belirli bir döküman numarası içerisindeki tüm barkodları çıkartır ve bir excel tablosuna aktarır. Aktarılan excel tablosu
servisin bulunduğu klasörün içerisinde bulunabilir. */
async function getBar() {
    try {
        const sp = await ShippingReceipt.findOne({"documentNum":"SI1_000485636"});
        var allBarcodes = await extractAssortment(sp._id, sp);
        var wb = new xl.Workbook();
        var ws = wb.addWorksheet('Sheet 1');
        var style = wb.createStyle({
            font: {
              color: '#000000',
              size: 12,
            }
          });
          
        for (let index = 0; index < allBarcodes.length; index++) {
            const element = allBarcodes[index];
            ws.cell(index+1, 1)
            .string(element.barcode)
            .style(style);
            ws.cell(index+1, 2)
            .number(element.qty)
            .style(style);


        }
        wb.write('Abarcodes.xlsx');
        console.log(allBarcodes);

    }
    catch(err)
    {    
        console.log(err);
    }
}
getBar();