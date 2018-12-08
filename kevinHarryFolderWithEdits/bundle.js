(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){


const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: '/Users/danielknight/Desktop/csvgentest.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'lang', title: 'LANGUAGE'}
    ]
});
 
;
 

function createList(first_value_global,second_value_global) {
    console.log(first_value_global);
    console.log(second_value_global);
    const records = [
    {name: first_value_global,  lang: 'French, English'},
    {name: second_value_global, lang: 'English'}
]
    csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });
}


},{"csv-writer":2}],2:[function(require,module,exports){

const CsvStringifierFactory = require('./lib/csv-stringifier-factory');
const CsvWriterFactory = require('./lib/csv-writer-factory');

const csvStringifierFactory = new CsvStringifierFactory();
const csvWriterFactory = new CsvWriterFactory({csvStringifierFactory});

module.exports = {

    createArrayCsvStringifier: params =>
        csvStringifierFactory.createArrayCsvStringifier(params),

    createObjectCsvStringifier: params =>
        csvStringifierFactory.createObjectCsvStringifier(params),

    createArrayCsvWriter: params =>
        csvWriterFactory.createArrayCsvWriter(params),

    createObjectCsvWriter: params =>
        csvWriterFactory.createObjectCsvWriter(params)

};

},{"./lib/csv-stringifier-factory":3,"./lib/csv-writer-factory":7}],3:[function(require,module,exports){

'use strict';

const ArrayCsvStringifier = require('./csv-stringifiers/array');
const FieldStringifier = require('./field-stringifier');
const ObjectCsvStringifier = require('./csv-stringifiers/object');

const DEFAULT_FIELD_DELIMITER = ',';
const VALID_FIELD_DELIMITERS = [DEFAULT_FIELD_DELIMITER, ';'];

class CsvStringifierFactory {

    createArrayCsvStringifier(params) {
        const fieldDelimiter = params.fieldDelimiter || DEFAULT_FIELD_DELIMITER;
        _validateFieldDelimiter(fieldDelimiter);
        return new ArrayCsvStringifier({
            fieldStringifier: new FieldStringifier({fieldDelimiter}),
            fieldDelimiter,
            header: params.header
        });
    }

    createObjectCsvStringifier(params) {
        const fieldDelimiter = params.fieldDelimiter || DEFAULT_FIELD_DELIMITER;
        _validateFieldDelimiter(fieldDelimiter);
        return new ObjectCsvStringifier({
            fieldStringifier: new FieldStringifier({fieldDelimiter}),
            fieldDelimiter,
            header: params.header
        });
    }

}

function _validateFieldDelimiter(delimiter) {
    if (VALID_FIELD_DELIMITERS.indexOf(delimiter) === -1) {
        throw new Error(`Invalid field delimiter \`${delimiter}\` is specified`);
    }
}

module.exports = CsvStringifierFactory;

},{"./csv-stringifiers/array":5,"./csv-stringifiers/object":6,"./field-stringifier":9}],4:[function(require,module,exports){
'use strict';

const RECORD_DELIMITER = '\n';

class AbstractCsvStringifier {

    constructor(params) {
        this._fieldStringifier = params.fieldStringifier;
        this._fieldDelimiter = params.fieldDelimiter;
    }

    getHeaderString() {
        const headerRecord = this._getHeaderRecord();
        return headerRecord ? this.stringifyRecords([headerRecord]) : null;
    }

    stringifyRecords(records) {
        const csvLines = Array.from(records, record => this._getCsvLine(this._getRecordAsArray(record)));
        return csvLines.join(RECORD_DELIMITER) + RECORD_DELIMITER;
    }

    /* istanbul ignore next */_getRecordAsArray(_record) {
        throw new Error('Must be overridden in subclasses');
    }

    /* istanbul ignore next */_getHeaderRecord() {
        throw new Error('Must be overridden in subclasses');
    }

    _getCsvLine(record) {
        return record
            .map(fieldValue => this._fieldStringifier.stringify(fieldValue))
            .join(this._fieldDelimiter);
    }

}

module.exports = AbstractCsvStringifier;

},{}],5:[function(require,module,exports){

'use strict';

const AbstractCsvStringifier = require('./abstract');

class ArrayCsvStringifier extends AbstractCsvStringifier {

    constructor(params) {
        super({
            fieldStringifier: params.fieldStringifier,
            fieldDelimiter: params.fieldDelimiter
        });
        this._header = params.header;
    }

    _getHeaderRecord() {
        return this._header;
    }

    _getRecordAsArray(record) {
        return record;
    }

}

module.exports = ArrayCsvStringifier;

},{"./abstract":4}],6:[function(require,module,exports){

'use strict';

const AbstractCsvStringifier = require('./abstract');

class ObjectCsvStringifier extends AbstractCsvStringifier {

    constructor(params) {
        super({
            fieldStringifier: params.fieldStringifier,
            fieldDelimiter: params.fieldDelimiter
        });
        this._header = params.header;
    }

    _getHeaderRecord() {
        const isHeaderAvailable = isObject(this._header && this._header[0]);
        if (!isHeaderAvailable) return null;

        return this._header.reduce((memo, field) =>
            Object.assign({}, memo, {[field.id]: field.title}), {});
    }

    _getRecordAsArray(record) {
        return this._header.map(field => record[this._getFieldId(field)]);
    }

    _getFieldId(field) {
        return isObject(field) ? field.id : field;
    }

}

function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

module.exports = ObjectCsvStringifier;

},{"./abstract":4}],7:[function(require,module,exports){

'use strict';

const CsvWriter = require('./csv-writer');
const fs = require('fs');

class CsvWriterFactory {

    constructor(params) {
        this._csvStringifierFactory = params.csvStringifierFactory;
    }

    createArrayCsvWriter(params) {
        const csvStringifier = this._csvStringifierFactory.createArrayCsvStringifier({
            header: params.header,
            fieldDelimiter: params.fieldDelimiter
        });
        return new CsvWriter({
            csvStringifier,
            encoding: params.encoding,
            fs,
            path: params.path,
            append: params.append
        });
    }

    createObjectCsvWriter(params) {
        const csvStringifier = this._csvStringifierFactory.createObjectCsvStringifier({
            header: params.header,
            fieldDelimiter: params.fieldDelimiter
        });
        return new CsvWriter({
            csvStringifier,
            encoding: params.encoding,
            fs,
            path: params.path,
            append: params.append
        });
    }

}

module.exports = CsvWriterFactory;

},{"./csv-writer":8,"fs":10}],8:[function(require,module,exports){

'use strict';

const DEFAULT_ENCODING = 'utf8';
const DEFAULT_INITIAL_APPEND_FLAG = false;

class CsvWriter {

    constructor(params) {
        this._fs = params.fs;
        this._path = params.path;
        this._csvStringifier = params.csvStringifier;
        this._encoding = params.encoding || DEFAULT_ENCODING;
        this._append = params.append || DEFAULT_INITIAL_APPEND_FLAG;
    }

    writeRecords(records) {
        const headerString = !this._append && this._csvStringifier.getHeaderString();
        const recordsString = this._csvStringifier.stringifyRecords(records);
        const writeString = (headerString || '') + recordsString;
        const option = this._getWriteOption();
        return this._write(writeString, option)
            .then(() => { this._append = true; });
    }

    _write(string, options) {
        return new Promise((resolve, reject) => {
            this._fs.writeFile(this._path, string, options, err => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    _getWriteOption() {
        return {
            encoding: this._encoding,
            flag: this._append ? 'a' : 'w'
        };
    }

}

module.exports = CsvWriter;

},{}],9:[function(require,module,exports){

'use strict';

class FieldStringifier {

    constructor(params) {
        this._fieldDelimiter = params.fieldDelimiter;
    }

    stringify(value) {
        if (typeof value === 'undefined' || value === null) return '';
        const str = String(value);
        return this._needsQuote(str) ? `"${str.replace(/"/g, '""')}"` : str;
    }

    _needsQuote(str) {
        return str.includes(this._fieldDelimiter) || str.includes('\n') || str.includes('"');
    }

}

module.exports = FieldStringifier;

},{}],10:[function(require,module,exports){

},{}]},{},[1]);
