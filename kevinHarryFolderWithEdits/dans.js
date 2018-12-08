

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: '/Users/danielknight/Desktop/csvgentest.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'lang', title: 'LANGUAGE'}
    ]
});
 
const records = [
    {name: first_value_global,  lang: 'French, English'},
    {name: second_value_global, lang: 'English'}
];
 

function createList() {
    console.log(first_value_global);
    console.log(second_value_global)
    csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });
}

