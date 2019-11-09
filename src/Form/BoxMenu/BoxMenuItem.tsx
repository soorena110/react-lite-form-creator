import * as React from "react";
import {ReactNode} from "react";
import './BoxMenuItem.css';

const FavoriteIcon = require('./star.svg').default;
const NotFavoriteIcon = require('./star-outline.svg').default;

export const localStoragePrefix = 'menuItemFavorite_';

export interface BoxMenuItemProps {
    value: any;
    title: string;

    content?: ReactNode;
    sideContent?: any;
    data?: any;
    onClick?: () => void;
    hasSeparator?: boolean;
    isGroupTitle?: boolean;

    onChange?: (event: {
        newValue: any,
        data: any,
    }) => void;
}

interface Props extends BoxMenuItemProps {
    isSelected: boolean;
    localFavoriteKey: string | undefined;
}


interface State {
    isHovered: boolean;
}

export default class BoxMenuItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isHovered: false
        };
    }


    private _handleChangeValue() {
        if (this.props.onChange) {
            const e = {
                data: this.props.data,
                newValue: this.props.value
            };
            this.props.onChange(e);
        }
    }

    private _handleItemClick() {
        if (this.props.isGroupTitle)
            return;

        if (this.props.onClick)
            this.props.onClick();
        this._handleChangeValue();
    }

    private _handleMouseOver() {
        if (!this.state.isHovered)
            this.setState({isHovered: true})
    }

    private _handleMouseOut() {
        if (this.state.isHovered)
            this.setState({isHovered: false})
    }

    private _renderFavoriteIcon(item: BoxMenuItemProps) {
        if (!this.props.localFavoriteKey) return;

        const localStorageKey = localStoragePrefix + this.props.localFavoriteKey;
        const localStorageValue = localStorage.getItem(localStorageKey);
        const keyDictionary = localStorageValue ? JSON.parse(localStorageValue) : {};

        const setItemAsFavorite = () => {
            if (!keyDictionary[item.title])
                keyDictionary[item.title] = true;
            else delete keyDictionary[item.title];
            localStorage.setItem(localStorageKey, JSON.stringify(keyDictionary));
            this.setState({});
        };

        const isFavorite = keyDictionary[item.title];
        return <span style={{display: 'inline-block', float: 'right'}}>
           {isFavorite ?
               <FavoriteIcon style={{background: 'orange'}}
                             onClick={() => setItemAsFavorite()}/> :
               <NotFavoriteIcon style={{background: 'orange'}}
                                onClick={() => setItemAsFavorite()}/>}
        </span>
    }


    render() {
        const className = (this.props.isGroupTitle && 'box-menu-item-group' || 'box-menu-item') +
            (this.props.isSelected ? ' gray-light' : this.state.isHovered ? ' gray-lighter' : '');

        return <React.Fragment>
            {this.props.hasSeparator &&
            <div className="box-menu-divider"/>}
            <div className={className}
                 onMouseMove={() => this._handleMouseOver()}
                 onMouseLeave={() => this._handleMouseOut()}>
                <span style={{display: 'inline-block', float: 'left'}}>{this.props.sideContent}</span>
                {this._renderFavoriteIcon(this.props)}
                <div title={this.props.title} onClick={() => this._handleItemClick()}
                     className="box-menu-item-content">{this.props.content || this.props.title}</div>
            </div>
        </React.Fragment>
    }

}