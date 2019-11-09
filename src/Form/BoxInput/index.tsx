import * as React from 'react';
import './style.scss';
import {BoxInputBaseProps} from "./_base";

export interface BoxInputProps extends BoxInputBaseProps {
    maxLength?: number;
    type?: 'string' | 'password';
    htmlInputClassName?: string
}

interface State {
    isFocused: boolean;
}

export default class BoxInput extends React.Component<BoxInputProps, State> {
    constructor(props: BoxInputProps) {
        super(props);
        this.state = {isFocused: false};
    }

    static defaultProps: Partial<BoxInputProps> = {
        valueClassName: 'text-default-color'
    };

    private _getBorderColor() {
        if (this.state.isFocused)
            return 'border-gray border-2x box-input-padding-less';
        if (this.props.hasError)
            return 'border-error border-2x box-input-padding-less';
        return 'border-gray-light';
    }

    private _getValueColor() {
        if (this.props.hasError)
            return 'text-error';
        return this.props.valueClassName;
    }

    //#region Events

    private _handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        const {value, selectionStart, selectionEnd} = e.currentTarget;
        let newValue = value;

        if (e.key != 'Enter')
            newValue = value.substr(0, selectionStart as number) + e.key +
                value.substr(selectionEnd as number, e.currentTarget.value.length - (selectionEnd as number));

        if (this.props.onKeyPress)
            this.props.onKeyPress({key: e.key, newValue, preventDefault: () => e.preventDefault()})
    }

    private _handleChangeValue(newValue: string) {
        if (this.props.onChange)
            this.props.onChange({newValue: newValue});
    }

    private _handleBlur() {
        this.setState({isFocused: false});
        if (this.props.onBlur)
            this.props.onBlur({});
    }

    private _handleFocus() {
        this.setState({isFocused: true});
        if (this.props.onFocus)
            this.props.onFocus({});
    }

    //#endregion

    //#region Render

    private _renderInputField() {
        const valueColor = this._getValueColor();
        const style = Object.assign({direction: 'rtl'}, this.props.htmlInputStyle);

        const className = `box-input-input border-radius ${this.props.htmlInputClassName || ''} ${valueColor}`;

        return <input id={this.props.name}
                      name={this.props.name}
                      className={className}
                      type={this.props.type == 'password' ? 'password' : undefined}
                      onFocus={() => this._handleFocus()}
                      onKeyPress={e => this._handleKeyPress(e)}
                      onBlur={() => this._handleBlur()}
                      placeholder={this.props.placeholder}
                      disabled={this.props.isDisabled}
                      autoComplete="off"
                      maxLength={this.props.maxLength}
                      style={style}
                      value={this.props.value}
                      onChange={e => this._handleChangeValue(e.currentTarget.value)}
                      autoFocus={this.props.autoFocus}/>
    }

    render() {
        const borderColor = this._getBorderColor();
        const className = `box-input clean border-radius ${borderColor} ${this.props.className || ''}`;

        return (
            <label className={className}
                   style={this.props.style}
                   title={this.props.tooltip}>
                <div className="box-input-content">
                    <div className="box-input-label text-gray-deep">
                        {this.props.label}
                    </div>
                    {this._renderInputField()}
                </div>
                {this.props.children}
            </label>
        )
    }

    //#endregion
}
