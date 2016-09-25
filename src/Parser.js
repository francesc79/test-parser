
/**
 * Utility Class
 * @author Francesco Zanutto <francesco.zanutto@gmail.com>
 */
class Utility {

    /**
     * Method for check if argument is a string object
     * @param {object} obj - Objects.
     */    
    static isString (obj) {
        return typeof obj === 'string';
    }  
}

/** Query element array patter */
const QUERY_ELEMENT_ARRAY_PATTERN = /\[(.+)\]/g;

/** Query element validation patter */
const QUERY_ELEMENT_VALIDATION_PATTERN = /(^\w+[\[]{1}[^0-9]+[a-zA-Z0-9_.]+[\]]{1}$)|(^\w+$)/g;

/**
 * This class manages an element of query string. 
 * @see {@link Query} for more details about Query String
 * 
 * @author Francesco Zanutto <francesco.zanutto@gmail.com>
 */
class QueryElement {

    /**
     * Create a QueryElement
     * @param {string} qryElemString - Query Element
     */
    constructor (qryElemString = '') {  
        this._parse (qryElemString);
    }

    _parse (qryElemString) {
        this._validator(qryElemString);
        let matchers = QUERY_ELEMENT_ARRAY_PATTERN.exec(qryElemString);
        if (matchers) {
            this._propertyName = qryElemString.replace (QUERY_ELEMENT_ARRAY_PATTERN, '');
            this._query = new Query (matchers[1]);
        }
        else {
            this._propertyName = qryElemString;
        }
    }

    _validator (qryElemString) {
        if (!Utility.isString(qryElemString)) {
            throw new ParserError("ERR_CODE_300", "Query Element is empty");
        }
        if (!qryElemString.match(QUERY_ELEMENT_VALIDATION_PATTERN)) {
            throw new ParserError("ERR_CODE_301", `Query Element with value '${qryElemString}' is not valid`);
        }
    }

    /**
     * Returns a propery name
     * @return {string} property name
     */
    get propertyName () {
        return this._propertyName;
    }      

    /**
     * Returns a boolean if true means <pre>prop[prop1]</pre> otherwise means <pre>prop</pre>
     * @return {boolean} complex element
     */
    get isComplex () {
        return this._query?true:false;
    }  

    /**
     * Returns a Query object inside a squere brackets
     * @return {Query} Query
     */
    get query () {
        return this._query;
    }   

    /**
     * Returns a string representation of the object.
     * @return {string} object value.
     */
    toString () {
        return this.propertyName + (this.isComplex ? '[' + this.query + ']':'');
    }     
}

/**
 * This class manages a query string. 
 * <p>
 *  The query string is a string that identifies a property inside a object.
 *  It can have a dot separator if property is inside a sub-object ex. address.city
 *  It can have square brackets if property is an array. Inside square brackets there is 
 *      a query string to read an index of array.
 * </p>
 * 
 * @author Francesco Zanutto <francesco.zanutto@gmail.com>
 */
class Query {

    /** 
     * Construct a Query 
     * @param {string} queryString - Query String
     * */
    constructor (queryString) {
        this.elements = [];
        this._parse(queryString);
    }

    _parse (queryString) {

        this._validator(queryString);

        let matchers = [];
        let regExp = /(\w+[\[]{1}\W*[0-9a-zA-Z_.]+\W*[\]]{1})|(\w+)/g;
        while ((matchers = regExp.exec(queryString)) !== null) {
            this.elements.push(new QueryElement(matchers[0]));
        }
    }

    _validator (queryString) {
        if (!queryString || !Utility.isString(queryString)) {
            throw new ParserError("ERR_CODE_200", "Query String is empty");
        }        
    }

    /**
     * Iterator of QueryElement
     * @return {string} The code value.
     */
    *iterator () {
        for (let element of this.elements) {
            yield element;
        }
    }

    /**
     * Returns a string representation of the object.
     * @return {string} object value.
     */
    toString () {
        let ret = "";
        for (let element of this.iterator()) {
            if (ret.length > 0) {
                ret += '.';
            }
            ret += element;
        }
        return ret;
    }       
}

export 
/**
 * This class is used for raise a parser error.
 *  
 * @author Francesco Zanutto <francesco.zanutto@gmail.com>
 */
class ParserError extends Error {
    
    /**
     * Create a ParserError
     * @param {string} code - code
     * @param {string} message - message
     */
    constructor(code,message) {
        super(message)
        this._code = code;
    }

    /**
     * Get the code value.
     * <ul style="list-style: none;">
     *  <li> ERR_CODE_100:   property not found 
     *  <li> ERR_CODE_101:   context is empty
     *  <li> ERR_CODE_200:   query string is empty 
     *  <li> ERR_CODE_300:   query element is empty
     *  <li> ERR_CODE_301:   query element is not valid
     * </ul>
     * @return {string} The code value.
     */
    get code () {
        return this._code;
    }
}

export 
/**
 * This class is a parser you can use in two ways:
 *<pre class="prettyprint">
 *      let context = {name:'pluto'};
 *      let query = 'name';
 *      console.log ("val:" + Parser.parse(context, query));
 *</pre>
 * or
 *<pre class="prettyprint">
 *      let context = {name:'pluto', city:'Roma'};
 *      let query = 'name';
 *      let parser = new Parser(context);
 *  
 *      console.log ("val:" + parser.parse('name'));
 *      console.log ("val:" + parser.parse('city'));
 *</pre>
 * 
 * @author Francesco Zanutto <francesco.zanutto@gmail.com>
 */
class Parser {

    /**
     * Construct Parser
     * @param {object} context - Context
     */
    constructor (context = {}) {
        this._context = context;
    }

    _getValue (query) {
        let contextRef = this._context;
        for (let qryElem of query.iterator()) {

            if (!contextRef.hasOwnProperty(qryElem.propertyName)) {
                throw new ParserError('ERR_CODE_100', `Property ${qryElem.propertyName} not found`);
            }
            contextRef = contextRef[qryElem.propertyName];
            if (qryElem.isComplex) {
                contextRef = contextRef[this._getValue(qryElem.query)];
            }
        }
        return contextRef;
    }

    /**
     * Parse query string and return a value of property
     * @param {string} queryString - query string
     * @return Return a value of property idenified by query string
     */
    parse (queryString = '') {        
        return this._getValue(new Query(queryString));         
    }

    /**
     * Parser 
     * @param {object} context - Context
     * @param {string} queryString - query string
     * @return Return a value of property idenified by query string
     */
    static parse (context, queryString) {
        return new Parser(context).parse(queryString);
    }
}
