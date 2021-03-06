import React from "react";

interface IProps {
    className?: string
}

const SwapHorizIcon = (props: IProps) => {
    const { className } = props;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className || ""} height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/></svg>
    )
}

export default SwapHorizIcon;