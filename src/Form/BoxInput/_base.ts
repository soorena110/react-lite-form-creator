import * as React from "react";
import {ReactNode} from "react";

export interface BoxInputBaseProps {
    name: string;
    label?: ReactNode;
    value?: string;
    isDisabled?: boolean;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    autoFocus?: boolean;

    tooltip?: string;


    hasError?: boolean;
    htmlInputStyle?: React.CSSProperties;
    htmlInputClassName?: string;

    onKeyPress?: (e: KeyPressEvent) => boolean | void;
    onFocus?: (e: {}) => void;
    onBlur?: (e: {}) => void;
    onChange?: (e: { newValue: string }) => void;

    valueClassName?: string;
}

export interface KeyPressEvent {
    key: string;
    newValue: string;
    preventDefault: () => void;
}