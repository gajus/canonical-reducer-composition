# Canonical Reducer Composition

* [Spec](#spec)
* [Implementation Example](#implementation-example)
* [Benefits](#benefits)
* [Redux Reducer Composition](#redux-reducer-composition)
* [Validator Library](#validator-library)
* [Libraries](#libraries)

## Spec

Canonical Reducer Composition pattern requires that:

1. Action definition object has `type` property.
1. Action definition object `type` property value tests `/^[A-Z\_]+$/`.
1. Reducer definition object registers domains.
1. Domain definition object registers actions.
1. Action name corresponds to action definition object `type` property value.
1. Action name is unique in the entire reducer definition object.

```js
{
    <domain>: {
        <action> (domain, action) {

        }
    }
}
```

In addition, domain can define a sub-domain:

```js
{
    <domain>: {
        <domain>: {
            <action> (domain, action) {

            },
            <action> (domain, action) {

            }
        },
        <domain>: {
            <action> (domain, action) {

            }
        }
    }
}
```

## Action

* action *must* be a plain object.
* action *must* define `name` property.
* action `name` property value *must* be a string.
* action `name` property value *must* consist only of uppercase latin characters and one or more underscore characters.
* action *can* define `data` property`
* when defined, action `data` property value *must* be a plain object.
* action *can* define `metadata` property.
* when defined, action `metadata` property value *must* be a plain object.

## Benefits

Canonical Reducer Composition has the following benefits:

* Introduces reducer declaration convention.
* Domain reducer function is called only if it registers an action.
* Enables intuitive nesting of the domain model.

## Implementation Example

```js
import {
    createStore,
} from 'redux';

import {
    combineReducers
} from 'redux-immutable';

let state,
    reducer,
    store;

state = {
    // <domain>
    countries: [
        'IT',
        'JP',
        'DE'
    ],
    // <domain>
    cities: [
        'Rome',
        'Tokyo',
        'Berlin'
    ],
    // <domain>
    user: {
        // <domain>
        names: [
            'Gajus',
            'Kuizinas'
        ]
    }
}

reducer = {
    // Implementing country domain reducers using arrow function syntax.
    countries: {
        ADD_COUNTRY: (domain, action) => domain.push(action.country),
        REMOVE_COUNTRY: (domain, action) => domain.delete(domain.indexOf(action.country))
    },
    // Implementing city domain reducers using object method syntax.
    cities: {
        ADD_CITY (domain, action) {
            return domain.push(action.city);
        }
        REMOVE_CITY (domain, action) {
            return domain.delete(domain.indexOf(action.city));
        }
    },
    // Implement a sub-domain reducer map.
    user: {
        names: {
            ADD_NAME (domain, action) {
                return domain.push(action.name);
            }
            REMOVE_NAME (domain, action) {
                return domain.delete(domain.indexOf(action.name));
            }
        }
    }
};

state = Immutable.fromJS(state);
reducer = combineReducers(reducers);
store = createStore(reducer, state);
```

## Redux Reducer Composition

Redux utilizes the concept of [reducer composition](http://gaearon.github.io/redux/docs/basics/Reducers.html#splitting-reducers).

```js
let reducer = (state = {}, action) => ({
    // <domain>: <domainReducer> (<domain data>, <action>)
    countries: countryReducer(state.countries, action),
    cities: cityReducer(state.cities, action)
});
```

The benefit of this pattern is that domain reducers do not need to know the complete state; domain reducers receive only part of the state for their domain. This enables better code separation.

Redux [`combineReducers`](http://gaearon.github.io/redux/docs/api/combineReducers.html) is a helper that turns an object whose values are different reducing functions into a single reducing function.

```js
let reducer = combineReducers({
    countries: countryReducer,
    cities: cityReducer
});
```

However, Redux `combineReducers` does not dictate what should be the implementation of the domain reducer. Regardless of what is the implementation of the domain reducer, it does the same thing: listens to actions and when it recognizes an action, it create a new state, e.g.

```js
export function countries (state = [], action) {
    switch (action.type) {
        case 'ADD_COUNTRY':
            // state =
            return state;

        case 'REMOVE_COUNTRY':
            // state =
            return state;

        default:
            return state;
    }
}
```

There are several problems with this:

* This makes the code base less standardized (across different projects and different developers).
* Domain reducer function is called regardless of whether it can handle the action.
* The overhead of maintaining the boilerplate.

## Validator Library

Libraries that implement Canonical Reducer Composition pattern validation:

* https://github.com/gajus/canonical

## Libraries

Libraries that implement Canonical Reducer Composition:

* https://github.com/gajus/redux-immutable
