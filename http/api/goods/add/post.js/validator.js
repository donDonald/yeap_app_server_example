'use strict';

const assert = require('assert');
const { check, oneOf } = require('express-validator');

module.exports = function(api) {
    assert(api);

    const rules = () => {
        return [
            check('gid').exists().matches(/^[A-Za-z0-9 ]+$/),
            check('name').exists().matches(/^[A-Za-z0-9 ]+$/),
            check('amount').exists().matches(/^[0-9 ]+$/),
        ];
    }

    const validate = api.lib.validators.validate;

    return {
        rules,
        validate,
    }
}
