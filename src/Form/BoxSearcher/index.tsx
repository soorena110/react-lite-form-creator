import * as React from 'react';
import './style.css';
import BoxDropDown, {BoxDropdownProps} from "../DropDown";

const SearchIcon = require('./magnify.svg').default;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface BoxSearchInputProps extends Omit<Omit<BoxDropdownProps, 'type'>, 'items'> {
    type?: 'searcher';
    dataSetterOnChange: (
        value: string,
        setter: (values: SearchResultItem[]) => void
    ) => void;
}

interface State {
    isFocused: boolean;
    searchResult: any
}

export interface SearchResultItem {
    title: string;
    value: any;
}

export default class BoxSearchInput extends React.Component<BoxSearchInputProps, State> {
    _accidentPreventingCounter = 0;

    constructor(props: BoxSearchInputProps) {
        super(props);
        this.state = {
            isFocused: false,
            searchResult: []
        };
    }

    private _itemDataSetter(searchResult: SearchResultItem[], currentAccidentPreventingId: number) {
        if (currentAccidentPreventingId != this._accidentPreventingCounter)
            return;
        this.setState({searchResult});
    }

    render() {
        const className = 'box-input-search ' + (this.props.className ? this.props.className : '');
        const arrow = this.props.arrow != undefined ? this.props.arrow :
            <SearchIcon className="box-input-search-icon" icon="search"/>;
        return (
            <BoxDropDown {...this.props}
                         type="dropdown"
                         className={className}
                         arrow={arrow}
                         onSearch={e => {
                             const currentAccidentPreventingId = ++this._accidentPreventingCounter;
                             this.props.dataSetterOnChange((e.value as any),
                                 (values) => this._itemDataSetter(values, currentAccidentPreventingId));
                         }}
                         items={this.state.searchResult.map((val: any) => ({
                             title: val.title,
                             value: val.value
                         }))}
                         searchable
            />
        )
    }
}
