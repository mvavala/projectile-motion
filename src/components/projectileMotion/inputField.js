import React from 'react';
import './inputField.scss';

const InputField = (props) => {
    return (
        <div className='input-field-container'>
            <label className='grid-label' htmlFor={props.id}>
                {props.label}
            </label>
            <input
                id={props.id}
                type='text'
                placeholder={props.placeholder}
                defaultValue={props.defaultValue}
                onChange={(e) => props.handleChange(e.target)}
            ></input>
        </div>
    );
};

export default InputField;
