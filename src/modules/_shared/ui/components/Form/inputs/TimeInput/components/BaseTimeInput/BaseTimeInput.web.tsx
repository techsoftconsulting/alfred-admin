import React from 'react';
import { BaseTimeInputProps } from './BaseTimeInputProps';
import moment from 'moment';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const initialDate = new Date();

export default function BaseTimeInput(props: BaseTimeInputProps) {
    const date = props.value;

    return (
            /*   <DatePicker
                   {...props}
                   show={true}
                   onChange={(date) => {
                       props.onChangeText && props.onChangeText(date);
                   }}
                   value={date}
                   mode='time'
                   is24Hour={props.is24Hour ?? true}
               />
       */
            <TimePicker
                    {...props}
                    value={date ? moment(date) : undefined}
                    onChange={(date) => {
                        props.onChangeText && props.onChangeText(date ? date?.toDate() : null);
                    }}
            />
    );
}
