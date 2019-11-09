import * as React from 'react';
import {ReactNode} from 'react';
import * as ReactDOM from 'react-dom';
import './style.css';
import BoxMenuAddNewItem, {BoxMenuAddNewItemProps} from "./BoxMenuAddNewItem";
import BoxMenuItem, {BoxMenuItemProps, localStoragePrefix} from "./BoxMenuItem";
import ScrollbarContainer from "../../Container/ScrollbarContainer";
import Persian from "persian-info";
import Empty from "../../Container/Empty";
import BoxInput from "../BoxInput";

export {BoxMenuItemProps, BoxMenuAddNewItemProps};

export interface BoxMenuProps {
    name: string;
    items: BoxMenuItemProps[];

    type?: 'menu';
    label?: ReactNode;
    onChange?: (event: {
        newValue: any,
        data: any,
    }) => void;
    onSearch?: (event: {
        value: string
    }) => void;
    value?: any;
    searchable?: boolean;
    addNewItemProps?: BoxMenuAddNewItemProps;

    /// [localFavoriteKey] Shows a favorite icon near each field. Its value shows local storage key.
    localFavoriteKey?: string;
}


interface State {
    searchText: string;
}


export default class BoxMenu extends React.Component<BoxMenuProps, State> {
    private _theScrollbar?: ScrollbarContainer | null;
    private _theScrollbarContent?: HTMLDivElement | null;

    constructor(props: BoxMenuProps) {
        super(props);
        this.state = {
            searchText: ''
        };
    }

    componentDidMount = () => this._computeAndSetListPositionAndHeight();
    componentDidUpdate = () => this._computeAndSetListPositionAndHeight();


    private _search(searchedText: string) {
        if (this.props.onSearch)
            this.props.onSearch({value: searchedText});
        this.setState({searchText: searchedText})
    }

    private _isItemSelected(item: BoxMenuItemProps) {
        return item.value == this.props.value;
    }

    private _handleItemChange(event: { newValue: any, data: any, }) {
        if (this.props.onChange)
            this.props.onChange(event)
    }

    private _getVisibleAndSortedItems() {
        let itemsContainingSearchText = this.props.items.filter(r => Boolean(r));
        if (this.state.searchText != '') {
            const searchText = Persian.letter.convertArabicCharsToPersianChars(this.state.searchText);
            if (searchText)
                itemsContainingSearchText = itemsContainingSearchText
                    .filter(item => (Persian.letter.convertArabicCharsToPersianChars(item.title) as string).indexOf(searchText) != -1);
        }

        if (this.props.localFavoriteKey) {
            const localStorageKey = localStoragePrefix + this.props.localFavoriteKey;
            const localStorageValue = localStorage.getItem(localStorageKey);
            const keyDictionary = localStorageValue ? JSON.parse(localStorageValue) : {};

            itemsContainingSearchText.sort((m, n) => {
                if (keyDictionary[m.title] == keyDictionary[n.title])
                    return 0;
                if (keyDictionary[m.title] && !keyDictionary[n.title])
                    return -1;
                return 1;
            });
        }

        return itemsContainingSearchText;
    }

    private _computeAndSetListPositionAndHeight() {
        if (!this._theScrollbar || !this._theScrollbarContent)
            return;

        const theScrollbar = ReactDOM.findDOMNode(this._theScrollbar) as HTMLDivElement;
        const theScrollbarContent = ReactDOM.findDOMNode(this._theScrollbarContent) as HTMLDivElement;
        theScrollbar.style.height = Math.min(theScrollbarContent.getBoundingClientRect().height, 200) + 'px';
    }

    private _renderItems() {
        const itemsContainingSearchText = this._getVisibleAndSortedItems();
        if (!itemsContainingSearchText.length)
            return <Empty>{this.state.searchText != '' ? 'هیچ موردی یافت نشد.' : 'لیست خالی است.'}</Empty>;


        return <ScrollbarContainer ref={ref => this._theScrollbar = ref} className="box-menu-list"
                                   style={{paddingLeft: 8, minHeight: 50}}>
            <div ref={ref => this._theScrollbarContent = ref}>
                {itemsContainingSearchText.map((item, ix) =>
                    <BoxMenuItem key={ix} {...item} isSelected={this._isItemSelected(item)}
                                 localFavoriteKey={this.props.localFavoriteKey}
                                 onChange={e => this._handleItemChange(e)}/>
                )}
            </div>
        </ScrollbarContainer>

    }

    private _renderMenuAddNewItem() {
        return this.props.addNewItemProps &&
            <React.Fragment>
                <div className="box-menu-divider"/>
                <BoxMenuAddNewItem {...this.props.addNewItemProps as any}/>
            </React.Fragment>;
    }

    private _renderSearch() {
        if (!this.props.searchable)
            return;

        return <BoxInput name={this.props.name + '_search'} type="string"
                         value={this.state.searchText} placeholder='جستجو'
                         autoFocus
                         className="box-menu-search"
                         onChange={e => this._search(e.newValue)}/>
    }

    render() {
        return <div className="box-menu clean border-gray-light border-radius">
            {this._renderSearch()}
            {this._renderItems()}
            {this._renderMenuAddNewItem()}
        </div>
    }
}
