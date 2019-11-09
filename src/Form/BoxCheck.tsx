import * as React from 'react';
import './BoxCheck.css';

export interface BoxCheckProps {
    type?: 'boolean';
    name: string;
    label: string;
    className?: string;
    style?: React.CSSProperties;
    value?: boolean;
    hasError?: boolean;
    onChange?: (e: {
        newValue: boolean,
    }) => void;
    isDisabled?: boolean;

    inputChild?: {
        className?: string;
        checkedClassName?: string;
    }
}


export default class BoxCheck extends React.Component<BoxCheckProps> {
    static defaultProps: Partial<BoxCheckProps> = {
        inputChild: {
            className: 'gray-light',
            checkedClassName: 'primary'
        }
    };

    private _handleOnClick() {
        if (this.props.isDisabled)
            return;

        const newValue = !this.props.value;
        if (this.props.onChange)
            this.props.onChange({newValue: newValue});
    }

    private _getBorderColor() {
        if (this.props.hasError)
            return 'border-error border-2x box-input-padding-less';
        return 'border-gray-light';
    }

    private _renderInputField() {
        const className = "box-input-check " +
            (this.props.value ? 'selected ' : '') +
            (this.props.value ?
                this.props.inputChild && this.props.inputChild.checkedClassName || '' :
                this.props.inputChild && this.props.inputChild.className || '');
        return <div className={className}>
            <span className="box-input-check-box clean"/>
        </div>
    }

    render() {
        const borderColor = this._getBorderColor();
        const className = `box-input box-check clean border-radius ${borderColor} ${this.props.className || ''}`;
        return <label onClick={() => this._handleOnClick()}
                      className={className}
                      style={this.props.style}>
            <div className="box-input-content">
                <div className="box-input-label text-gray-deep">
                    {this.props.label}
                </div>
                {this._renderInputField()}
            </div>
            {this.props.children}
        </label>
    }
}
