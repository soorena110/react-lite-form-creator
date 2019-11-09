import * as React from 'react';
import {ReactNode} from 'react';
import * as ReactDOM from 'react-dom';
import BoxMenu, {BoxMenuItemProps, BoxMenuProps} from "../BoxMenu";
import './style.css';
import BoxInput from "../BoxInput";

const DownIcon = require('./ic-f-down.svg').default;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type BoxDropDownItem = BoxMenuItemProps;

export interface BoxDropdownProps extends Omit<BoxMenuProps, 'type'> {
    type?: 'dropdown';

    isDisabled?: boolean;
    hasError?: boolean;
    placeholder?: string;

    className?: string;
    style?: React.CSSProperties;
    theme?: 'no-background';
    arrow?: ReactNode;
}

interface State {
    isListOpen: boolean;
}

export default class BoxDropDown extends React.Component<BoxDropdownProps, State> {
    private _theBoxInput: any;
    private _theList?: HTMLDivElement | null;
    private _shouldPreventClose = false;

    constructor(props: BoxDropdownProps) {
        super(props);
        this.state = {
            isListOpen: false,
        };
    }

    componentDidUpdate() {
        this._computeAndSetListPositionAndHeight()
    }

    close() {
        if (this._shouldPreventClose) {
            this._shouldPreventClose = false;
            return;
        }
        this.setState({isListOpen: false});
    }

    private _computeAndSetListPositionAndHeight() {
        if (this._theList && this._theBoxInput) {
            const theBoxInputDom = ReactDOM.findDOMNode(this._theBoxInput) as HTMLDivElement;
            const theList = ReactDOM.findDOMNode(this._theList) as HTMLDivElement;

            const theBound = theBoxInputDom.getBoundingClientRect();
            theList.style.left = theBound.left - 5 + 'px';
            theList.style.top = theBound.top - 5 + 'px';
            theList.style.width = theBound.width + 10 + 'px';
            theList.focus();
        }
    }

    private _handleChangeValue(e: { newValue: any, data: any }) {
        if (this.props.onChange)
            this.props.onChange(e);
        this.setState({isListOpen: false})
    }

    private _isItemSelected(item: BoxDropDownItem) {
        return item.value == this.props.value;
    }

    private _getSeletedItem() {
        return this.props.items.filter(r => r).find(item => this._isItemSelected(item));
    }

    private _getSelectedItemTitle() {
        const selectedItem = this._getSeletedItem();
        if (selectedItem) {
            if (selectedItem.title.length < 40)
                return selectedItem.title;
            return selectedItem.title.substr(0, 12) + '...' + selectedItem.title.substr(selectedItem.title.length - 12)
        }
    }

    private _getSelectedItemTooltip() {
        const selectedItem = this._getSeletedItem();
        if (selectedItem)
            return selectedItem.title;
        return undefined;
    }

    private _renderArrow() {
        return <span className="box-input-label-arrow-icon text-gray"
                     onClick={() => this.setState({isListOpen: true})}>
            {this.props.arrow ? this.props.arrow : <DownIcon/>}
        </span>
    }

    private _renderBoxInput() {
        const className = 'box-input-dropdown ' + (this.props.className || '') + ' ' + (this.props.theme || '');

        if (this.props.theme == 'no-background')
            return <div ref={ref => this._theBoxInput = ref} className={className} style={this.props.style} tabIndex={0}
                        onFocus={() => this.setState({isListOpen: true})} title={this._getSelectedItemTooltip()}>
                <label>{this.props.label}</label>
                <span className="box-input-dropdown-selected text-gray-deep">
                    {this._getSelectedItemTitle()}
                </span>
            </div>;

        const style = Object.assign({cursor: 'pointer'}, this.props.style);
        return <BoxInput className={className} style={style}
                         ref={ref => this._theBoxInput = ref} name={this.props.name} type="string"
                         htmlInputStyle={{cursor: 'pointer'}}
                         label={this.props.label} hasError={this.props.hasError} isDisabled={this.props.isDisabled}
                         value={this._getSelectedItemTitle() ? this._getSelectedItemTitle() : ""}
                         placeholder={this.props.placeholder}
                         onFocus={() => this.setState({isListOpen: true})} tooltip={this._getSelectedItemTooltip()}>
            {this._renderArrow()}
        </BoxInput>
    }

    private _renderList() {
        if (!this.state.isListOpen || this.props.isDisabled)
            return;

        return <div className="box-input-dropdown-background" onClick={() => this.close()} tabIndex={0}
                    onKeyDown={e => e.key == 'Escape' && this.close()}>
            <div ref={ref => this._theList = ref}
                 className="box-input-dropdown-list clean border-radius border-gray-lighter"
                 onClick={() => this._shouldPreventClose = true}>
                <BoxMenu {...this.props} type={undefined} onChange={e => this._handleChangeValue(e)}/>
            </div>
        </div>
    }

    render() {
        return <React.Fragment>
            {this._renderBoxInput()}
            {ReactDOM.createPortal(this._renderList(), document.body)}
        </React.Fragment>
    }
}
