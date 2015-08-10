import {
    expect
} from 'chai';

import validateAction from './../src/validateAction';
import describeThrow from './describeThrow';

describe('validateAction()', () => {
    describe('when action is not an object', () => {
        it('throws an error', () => {
            expect(() => {
                validateAction(null)
            }).to.throw(Error, 'Action definition must be a plain object.');
        });
    });
    describe('when action definition object', () => {
        let describeValidateActionThrow;

        describeValidateActionThrow = (when, message, value) => {
            describeThrow(when, message, () => {
                validateAction(value);
            })
        };

        describeValidateActionThrow(
            'does not define "name" property',
            'Action definition object must define "name" property.',
            {}
        );

        describeValidateActionThrow(
            '"name" property value does not consist only of uppercase alphabetical characters and underscores',
            'Action definition object "name" property value must consist only of uppercase alphabetical characters and underscores.',
            {
                name: 'lowercase'
            }
        );

        describeValidateActionThrow(
            '"data" property is present and it is not a plain object',
            'Action definition object "data" property value must be a plain object.',
            {
                name: 'FOO',
                data: 'not object'
            }
        );

        describeValidateActionThrow(
            '"metadata" property is present and it is not a plain object',
            'Action definition object "metadata" property value must be a plain object.',
            {
                name: 'FOO',
                metadata: 'not object'
            }
        );

        describeValidateActionThrow(
            'defines unknown properties',
            'Action definition object must not define unknown properties.',
            {
                name: 'FOO',
                foo: 'bar'
            }
        );
    });
});
