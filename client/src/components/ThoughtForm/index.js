import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries'; //we need to update the cache so the added thought shows up without refreshing

const ThoughtForm = () => {
    const [thoughtText, setText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    // the addThought() function will run the actual mutation. The error variable will initially be undefined but can change depending on if the mutation failed
    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        update(cache, { data: { addThought } }) {
          try {
            // could potentially not exist yet, so wrap in a try...catch
            //read whats currently in cache
            const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
            cache.writeQuery({
              query: QUERY_THOUGHTS,
              data: { thoughts: [addThought, ...thoughts] }
            });
          } catch (e) {
            console.error(e);
          }
      
          // update me object's cache, appending new thought to the end of the array
          const { me } = cache.readQuery({ query: QUERY_ME });
          cache.writeQuery({
            query: QUERY_ME,
            data: { me: { ...me, thoughts: [...me.thoughts, addThought] } }
          });
        }
      });
    const handleChange = event => {
        if (event.target.value.length <= 280) { //stops updating value of thoughttext once character count reachers 280
            setText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };
    const handleFormSubmit = async event => { //remember async returns promise......
        event.preventDefault();

        try {
            // add thought to database
            await addThought({//...... and await makes the function wait for the promise
                variables: { thoughtText }
            });

            // clear form value
            setText('');
            setCharacterCount(0);
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <div>
            <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>
            <form
                className="flex-row justify-center justify-space-between-md align-stretch"
                onSubmit={handleFormSubmit}
            >
                <textarea
                    placeholder="Here's a new thought..."
                    value={thoughtText}
                    className="form-input col-12 col-md-9"
                    onChange={handleChange}
                ></textarea>
                <button className="btn col-12 col-md-3" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ThoughtForm;

//line 14 with ternary operator: check the expression, do first thing if truthy, second thing if falsy