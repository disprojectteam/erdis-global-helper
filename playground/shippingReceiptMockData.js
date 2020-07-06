const Staging =require('./../server/models/staging')
// const {conn}=require('./../server/db/mongoose-erdis-middleware');
var s=['5638390445','5638390441','5638390424','5638390417','5638390393'];

ssss();
async function ssss() {
    for (let index = 0; index < s.length; index++) {
        const element = s[index];
        await new Staging({
            tableName: 'InventTransferTable',
            recId: element,
            appId: 'cl1',
            status: Staging.Status.N
        }).save();
    }  
}