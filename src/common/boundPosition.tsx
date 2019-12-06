import * as React from "react";
import {ReactInstance} from "react";
import * as ReactDOM from "react-dom";

export type BoundPosition =
    'top' | 'top left' | 'top right' | 'top center' |
    'bottom' | 'bottom right' | 'bottom left' | 'bottom center' |
    'right' | 'right top' | 'right bottom' | 'right center' |
    'left' | 'left top' | 'left bottom' | 'left center'


interface AbsolutePosition {
    top?: number,
    right?: number,
    left?: number,
    bottom?: number,
}

export const getPortalAbsolutePosition = (baseElement: ReactInstance | null | undefined,
                                          portalElement: ReactInstance | null | undefined,
                                          position: BoundPosition = "top"): AbsolutePosition => {
    if (!baseElement || !portalElement)
        return {};

    const baseElementHtml = ReactDOM.findDOMNode(baseElement) as HTMLElement;
    const bBound = baseElementHtml.getBoundingClientRect();

    const portalElementHtml = ReactDOM.findDOMNode(portalElement) as HTMLElement;
    const pBound = portalElementHtml.getBoundingClientRect();


    const ret: AbsolutePosition = {};


    if (position.startsWith('top'))
        ret.top = bBound.top - pBound.height;
    else if (position.indexOf('top') != -1)
        ret.top = bBound.top;
    else if (position.startsWith('bottom'))
        ret.top = bBound.bottom;
    else if (position.indexOf('bottom') != -1)
        ret.top = bBound.bottom - pBound.height;
    else ret.top = (bBound.top + bBound.bottom) / 2 - pBound.height / 2;

    if (position.startsWith('right'))
        ret.left = bBound.right;
    else if (position.indexOf('right') != -1)
        ret.left = bBound.right - pBound.width;
    else if (position.startsWith('left'))
        ret.left = bBound.left - pBound.width;
    else if (position.indexOf('left') != -1)
        ret.left = bBound.left;
    else ret.left = (bBound.left + bBound.right) / 2 - pBound.width / 2;

    return ret;
};