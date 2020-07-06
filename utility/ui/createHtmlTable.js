const createHtmlTable = (messageToSend, title) => {
    let temp = ``

    // get column names
    const columnsNames = []
    Object.keys(messageToSend).forEach((key) => {
        messageToSend[key].forEach((row) => {
            Object.keys(row).forEach((column) => {
                if (!columnsNames.includes(column))
                    columnsNames.push(column)
            })
        })
    })
    temp += `<div><h2>${title}</h2></div>`
    Object.keys(messageToSend).forEach((key) => {

        // table name
        temp += `
            <div style="border-bottom:2px solid gray">
                <h3>${key.toString().toUpperCase()}</h3>
            </div>
            <table>
            <tr>
            `
        // fill column names
        columnsNames.forEach((column) => {
            temp += `<th>${column}</th>`
        })
        temp += `</tr>`

        // fill cells
        messageToSend[key].forEach((row) => {
            temp += `<tr>`
            Object.keys(row).forEach((key) => {
                temp += `
                    <td>${row[key]}</td>
                `
            })
            temp += `</tr>`
        })

        temp += `</table><br/>`
    })
    return `<div style="border:1px solid gray;">` + temp + `</div><br/><br/><br/>`
}

module.exports = { createHtmlTable }