import _ from 'lodash';

let isDomainMap,
    isActionMap;

/**
 * @param {Object.<string, Object>} map
 * @return {Boolean} If every object property value is a plain object.
 */
isDomainMap = (map) => {
    return _.every(map, _.isPlainObject);
};

/**
 * @param {Object.<string, Function>} map
 * @return {Boolean} If every object property value is a function.
 */
isActionMap = (map) => {
    return _.every(map, _.isFunction);
};

export default (reducer) => {
    // _.values(reducers).length is used to ignore empty reducer definition.
    if (isActionMap(reducer) && _.values(reducer).length) {
        throw new Error('Reducer definition object must begin with a domain map definition.');
    }
};
