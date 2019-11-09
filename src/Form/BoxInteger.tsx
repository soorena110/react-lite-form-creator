import * as React from 'react';
import {BoxInputBaseProps, KeyPressEvent} from "./BoxInput/_base";
import BoxDecimal from "./BoxDecimal";

export interface BoxIntegerProps extends BoxInputBaseProps {
    type?: 'integer';
    maxLength?: number;
    hasSeparator?: false;
    hasNegativeValue?:boolean
}


export default class BoxInteger extends React.Component<BoxIntegerProps> {

    private _handleKeyPress(e: KeyPressEvent) {
        if (!new RegExp(/^-?[0-9۰-۹]*$/).test(e.newValue)) {
            e.preventDefault();
            return;
        }

        if (this.props.onKeyPress)
            this.props.onKeyPress(e);
    }

    render() {
        const {type, ...boxInputProps} = this.props;

        return <BoxDecimal {...boxInputProps}
                           onKeyPress={e => this._handleKeyPress(e)}
        />
    }
}
