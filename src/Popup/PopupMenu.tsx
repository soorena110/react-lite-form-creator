import * as React from "react";
import Popup, {PopupProps} from "./index";
import BoxMenu, {BoxMenuProps} from "../Form/BoxMenu";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface PopupMenuProps extends PopupProps, Omit<BoxMenuProps, 'type'> {
}

interface State {
    isVisible: boolean;
}

export default class PopupMenu extends React.Component<PopupMenuProps, State> {
    private _popupRef?: Popup | null;

    private handleMenuItemSelected(e: any) {
        if (this._popupRef)
            this._popupRef.close();

        if (this.props.onChange)
            this.props.onChange(e);
    }

    render() {
        return <Popup {...this.props} ref={ref => this._popupRef = ref}>
            <BoxMenu {...this.props} onChange={e => this.handleMenuItemSelected(e)}/>
            {this.props.children}
        </Popup>
    }
}