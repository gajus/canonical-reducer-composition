# Canonical Reducer Composition

* [Spec](#spec)
   * [Reducer Definition](#reducer-definition)
   * [Domain](#domain)
   * [Action](#action)
* [`CONSTRUCT` Action Handler](#construct-action-handler)
* [Schema](#schema)
* [Implementation Example](#implementation-example)
* [Benefits](#benefits)
* [Redux Reducer Composition](#redux-reducer-composition)
* [Validator Library](#validator-library)
* [Libraries](#libraries)

## Spec

Canonical Reducer Composition pattern requires that:

### Reducer Definition

* Reducer definition **must** register at least one domain.
* Action name **must** correspond to the action `name` property value.
* Action name **must** be unique in the entire reducer definition object.

### Domain

* Domain **must** own only sub-domains or action handlers.
* Domain **can** own another domain.
* Domain **can** own action handlers.
* Domain **can** own [`CONSTRUCT` action handler](#construct-action-handler).

### Action Handler

* Action handler **must** be a function.
* Action handler **must** not mutate its arguments.
* Action handler **must** return domain state.

### Action

* Action **must** be a plain object.
* Action **must** define `name` property.
    * Action `name` property value **must** be a string.
    * Action `name` property value **must** consist only of uppercase latin characters and one or more underscore characters (`/^[A-Z\_]+$/`).
* Action **can** define `data` property. When defined,
    * `data` property value **must** be a plain object.
* Action **can** define `metadata` property. When defined, 
    * `metadata` property value **must** be a plain object.
* Action **can** define `error` property. When defined,
    * It **must** be an object.
    * It **can** be an instance of [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error).
    * It **must** have `message` property.
    * It **must** have `name` property.

## `CONSTRUCT` Action Handler

* A domain can register `CONSTRUCT` action handler.
* `CONSTRUCT` can be used to construct the initial domain state.

The application must send `{name: 'CONSTRUCT'}` action to initialise the domain state, e.g.

```js
import {
    createStore
} from 'redux';

import {
     combineReducers
} from 'redux-immutable';

import * as reducers from './reducers';

import Immutable from 'immutable';

let reducer,
    state,
    store;

reducer = combineReducers(reducers);

state = Immutable.Map({});

// Invoking CONSTRUCT to build the initial state.
state = reducer(state, {
    name: 'CONSTRUCT'
});

store = createStore(reducer, state);
```

## Schema

Reducer definition with a single domain:

```js
{
    <domain>: {
        <action handler> (domain, action) {

        }
    }
}
```

In addition, domain can define a sub-domain:

```js
{
    <domain>: {
        <domain>: {
            /**
             * Constructs the initial domain state.
             * 
             * @param {Object} domain
             * @return {Object}
             */
            CONSTRUCT (domain) {
                
            },
            /**
             * @typedef Action
             * @see {@link https://github.com/gajus/canonical-reducer-composition#action}
             * @property {String} name
             */
            
            /**
             * @param {Object} domain
             * @param {Action} action
             */
            <action handler> (domain, action) {

            },
            <action handler> (domain, action) {

            }
        },
        <domain>: {
            <action handler> (domain, action) {

            }
        }
    }
}
```

## Benefits

Canonical Reducer Composition has the following benefits:

* Introduces reducer declaration convention.
* Domain reducer function is called only if it registers an action.
  * Enables logging of unhandled actions.
* Enables intuitive nesting of the domain model.

## Implementation Example

```js
import {
    createStore,
} from 'redux';

import {
    combineReducers
} from 'redux-immutable';

import Immutable from 'immutable';

let reducer,
    state,
    store;

state = {
    // <domain>
    countries: [
        'IT',
        'JP',
        'DE'
    ],
    // <domain>
    cities: [],
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
    countries: {
        ADD_COUNTRY: (domain, action) {
            return domain.push(action.country);
        },
        REMOVE_COUNTRY: (domain, action) {
            return domain.delete(domain.indexOf(action.country));
        }
    },
    cities: {
        // Using a constructor.
        CONSTRUCT () {
            return [
                'Rome',
                'Tokyo',
                'Berlin'
            ];
        },
        ADD_CITY (domain, action) {
            return domain.push(action.city);
        },
        REMOVE_CITY (domain, action) {
            return domain.delete(domain.indexOf(action.city));
        }
    },
    // Implement a sub-domain reducer map.
    user: {
        names: {
            ADD_NAME (domain, action) {
                return domain.push(action.name);
            },
            REMOVE_NAME (domain, action) {
                return domain.delete(domain.indexOf(action.name));
            }
        }
    }
};

reducer = combineReducers(reducer);

state = Immutable.fromJS(state);
// Invoking CONSTRUCT to build the initial state.
state = reducer(state, {
    name: 'CONSTRUCT'
});

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
