import {
    expect
} from 'chai';

import validateReducer from './../src/validateReducer';

import describeThrow from './describeThrow';

describe('validateReducer()', () => {
    describe('when reducer definition object', () => {
        let describeValidateReducerThrow;

        describeValidateReducerThrow = (when, message, value) => {
            describeThrow(when, message, () => {
                validateReducer(value);
            })
        };

        describeValidateReducerThrow(
            'does not begin with a domain map',
            'Reducer definition object must begin with a domain map definition.',
            {
                FOO: () => {}
            }
        );
    });
});
