import * as React from "react";

export interface BoxFormEventArgs {
    changingFieldName?: string;
    values: { [fieldName: string]: any };
    styles: { [fieldName: string]: React.CSSProperties | undefined };
    extraData: any;
}