const { ShippingOrderRespond } = require('../server/models/shippingOrderRespond');

deneme();
async function deneme() {
    const sp=await ShippingOrderRespond.findOne().sort({_id:-1});

    console.log(sp.date.toLocaleTimeString());
}