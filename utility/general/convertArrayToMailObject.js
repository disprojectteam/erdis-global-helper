// const array = [
//     {
//         id: '1234',
//         barcode: '123124',
//         createdAt: '11.05.2019',
//         'undesired': 'undesired'
//     },
//     {
//         id: '1412',
//         barcode: '11241224',
//         createdAt: '12.05.2019',
//         'undesired': 'undesired'
//     },
//     {
//         id: '54354',
//         barcode: '123555',
//         createdAt: '16.05.2019',
//         'undesired': 'undesired'
//     },
// ]

// const desiredObject = convertArrayToMailObject(array, 'key', ['id', 'barcode', 'createdAt'])

// const obj = {
//     key: [
//         {
//             id: '1234',
//             barcode: '123124',
//             createdAt: '11.05.2019'
//         },
//         {
//             id: '1234',
//             barcode: '123124',
//             createdAt: '11.05.2019'
//         },
//         {
//             id: '1234',
//             barcode: '123124',
//             createdAt: '11.05.2019'
//         },
//         {
//             id: '1234',
//             barcode: '123124',
//             createdAt: '11.05.2019'
//         },
//     ]
// }


const convertArrayToMailObject = (_array, _key, _desiredAttributes) => {
    const obj = {}
    obj[_key] = []
    var tempArr = []

    _array.forEach((model) => {
        const tempObj = {}
        _desiredAttributes.forEach((desiredattribute) => {
            tempObj[desiredattribute] = model[desiredattribute]
        })
        tempArr.push(tempObj)
    })
    obj[_key] = tempArr
    return obj
}

module.exports = { convertArrayToMailObject }