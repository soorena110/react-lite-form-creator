import {BoxFormContentProps} from "./BoxFormContent";
import {BoxFormMoreProps} from "./BoxFormMore";
import {BoxFormFieldListProps} from "./BoxFormFieldList";
import * as React from "react";
import {BoxFormEventArgs} from "./eventsModels";
import {BoxFieldByTypeProps} from "../BoxFieldByType";

export type BoxFormInputFieldProps = BoxFieldByTypeProps & {
    onFieldChange?: (e: BoxFormEventArgs) => void;
    defaultValue?: any;
    isEditForm?: boolean;
}

export type BoxFormFieldProps<T = {}> = BoxFormCommonProps<T> &
    (BoxFormInputFieldProps | BoxFormMoreProps<T> | BoxFormFieldListProps | BoxFormContentProps) & T;


export interface BoxFormCommonProps<T> {
    labelBuilder?: ((e: BoxFormEventArgs) => string);
    onInit?: (e: BoxFormEventArgs) => void;
    onlyShowIf?: (e: BoxFormEventArgs) => boolean;
    leftSide?: BoxFormFieldProps<T> | BoxFormFieldProps<T>[];
    style?: React.CSSProperties;
    validation?: BoxFormCommonPropsValidation;
}

export interface BoxFormCommonPropsValidation {
    isRequired?: boolean;
    minValue?: any;
    absoluteMinValue?: any;
    otherValidations?: OtherValidation[]
}

type OtherValidation = {
    conditionChecker: (e: BoxFormEventArgs) => boolean;
} & (
    { message: string; } |
    { messageBuilder: (e: BoxFormEventArgs) => string; }
    );