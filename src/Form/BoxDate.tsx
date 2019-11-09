import * as React from 'react';
import BoxInput from "./BoxInput";
import {DatePicker} from "react-persian-simple-calendar";
import * as ReactDOM from 'react-dom';
import './BoxDate.css';
import {BoxInputBaseProps, KeyPressEvent} from "./BoxInput/_base";
import Persian from "persian-info";

export interface BoxDateProps extends BoxInputBaseProps {
    type?: 'date';
}

interface State {
    isInputFocused: boolean;
    value?: string;
}

export default class BoxDate extends React.Component<BoxDateProps, State> {
    private _picker?: HTMLDivElement | null;
    private _inputBox: any;

    constructor(props: BoxDateProps) {
        super(props);

        let dateValue = undefined;
        if (props.value) {
            const dateParts = props.value.split('-').map(r => parseInt(r));
            const jalaliDate = Persian.date.convertDateTimeToJalali(new Date(dateParts[0], dateParts[1] - 1, dateParts[2]));
            dateValue = `${jalaliDate.year}/${jalaliDate.month}/${jalaliDate.day}`;
        }
        this.state = {
            isInputFocused: false,
            value: dateValue
        };
    }

    componentDidMount() {
        this._setDatePickerPosition();
    }

    componentDidUpdate() {
        this._setDatePickerPosition();
    }

    //#region Helpers

    private static _isDateValue(value: string) {
        return /^[1۱]?[34۳۴]?[0-9۰-۹]{0,2}\/?(([1۱][0-2۰-۲])|([0۰]?[1-9۱-۹]))?\/?(([3۳][0-1۰-۱])|([1-2۱-۲][0-9۰-۹])|([0۰]?[1-9۱-۹]))?$/.test(value);
    }

    //#endregion

    //#region Events

    private _setDatePickerPosition() {
        if (!this._picker)
            return;

        const inputBoxDom = ReactDOM.findDOMNode(this._inputBox) as HTMLInputElement;
        const bound = inputBoxDom.getBoundingClientRect();

        this._picker.style.top = bound.top + 35 + 'px';
        this._picker.style.left = bound.left + 'px';
    }

    private _focusTimeout: any;

    private _handleFocus() {
        clearTimeout(this._focusTimeout);
        this.setState({isInputFocused: true});

        if (this.props.onFocus)
            this.props.onFocus({});
    }

    private _handleBlur() {
        this._focusTimeout = setTimeout(() => {
            this.setState({isInputFocused: false})
        }, 200);


        if (this.props.onBlur)
            this.props.onBlur({});
    }

    private _handleChange(newValue: string) {
        newValue = Persian.number.convertPersianNumberToEnglish(newValue);

        this.setState({value: newValue});


        if (this.props.onChange) {
            const dateParts = newValue.split('/').map(v => parseInt(v));
            const dateSplit = Persian.date.convertJalaliToGregorian({
                year: dateParts[0],
                month: dateParts[1],
                day: dateParts[2]
            });
            const outDate = dateSplit.getFullYear() +
                '-' + dateSplit.getMonth().toString().padStart(2, '0') +
                '-' + dateSplit.getDate().toString().padStart(2, '0');

            this.props.onChange({newValue: outDate})
        }
    }

    private _handleKeyPress(e: KeyPressEvent) {
        if (!BoxDate._isDateValue(e.newValue)) {
            e.preventDefault();
            return;
        }

        if (this.props.onKeyPress)
            this.props.onKeyPress(e);
    }

    //#endregion

    //#region Render

    private _renderDatePicker() {
        return <div ref={ref => this._picker = ref} className="box-input-date-picker"
                    style={{
                        display: this.state.isInputFocused ? undefined : 'none',
                        position: 'absolute'
                    }}>
            <div className="box-input-date-picker-inside">
                <DatePicker selectedDay={this.state.value}
                            onDaySelected={e => {
                                this._handleChange(e.selectedDay);
                            }}
                            onBlur={() => this._handleBlur()}
                            onFocus={() => this._handleFocus()}/>
            </div>
        </div>
    }

    render() {
        const {type, ...rest} = this.props;
        return <BoxInput {...rest}
                         value={this.state.value}
                         onChange={e => this._handleChange(e.newValue)}
                         onBlur={() => this._handleBlur()}
                         onKeyPress={e => this._handleKeyPress(e)}
                         onFocus={() => this._handleFocus()}
                         htmlInputStyle={Object.assign({
                             textAlign: 'left',
                             direction: 'ltr'
                         }, this.props.htmlInputStyle)}
                         ref={ref => this._inputBox = ref}>

            {ReactDOM.createPortal(this._renderDatePicker(), document.body)}
        </BoxInput>
    }

    //#endregion
}
