import * as React from 'react';
import BoxCheck, {BoxCheckProps} from "./BoxCheck";
import BoxSearchInput, {BoxSearchInputProps} from "./BoxSearcher";
import BoxDropdown, {BoxDropdownProps} from "./DropDown";
import BoxDateTime, {BoxDateTimeProps} from "./BoxDateTime";
import BoxDate, {BoxDateProps} from "./BoxDate";
import BoxTime, {BoxTimeInputProps} from "./BoxTime";
import BoxInteger, {BoxIntegerProps} from "./BoxInteger";
import {BoxDecimalProps, default as BoxDecimal} from "./BoxDecimal";
import BoxInput, {BoxInputProps} from "./BoxInput";


export type BoxFieldByTypeProps = BoxInputProps | BoxCheckProps | BoxDateTimeProps | BoxIntegerProps | BoxDecimalProps |
    BoxDateProps | BoxSearchInputProps | BoxDropdownProps | BoxTimeInputProps

export default class BoxFieldByType extends React.Component<BoxFieldByTypeProps> {


    render() {
        switch (this.props.type) {
            case 'boolean':
                return <BoxCheck {...this.props}/>;
            case 'searcher':
                return <BoxSearchInput {...this.props}/>;
            case 'dropdown':
                return <BoxDropdown {...this.props}/>;
            case 'datetime':
                return <BoxDateTime {...this.props}/>;
            case 'date':
                return <BoxDate {...this.props}/>;
            case 'time':
                return <BoxTime {...this.props}/>;
            case 'integer':
                return <BoxInteger {...this.props}/>;
            case 'decimal':
                return <BoxDecimal {...this.props}/>;
            case 'string':
            case 'password':
                return <BoxInput {...this.props}/>;

            default:
                throw Error('Type `' + this.props.type + '` is not allowed');
        }
    }

    //#endregion
}
