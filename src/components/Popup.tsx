import React, { FC, PropsWithChildren } from 'react'

interface PopupProps {
    outsideClick?: React.MouseEventHandler<HTMLDivElement>
}
export const Popup: FC<PropsWithChildren<PopupProps>> = ({ children, outsideClick }) => {
    return (
        <div style={{
            position: "absolute",
            display: "flex",
            top: 0,
            left: 0,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
        }}>
            <div
                onClick={outsideClick}
                style={{
                    position: "fixed",
                    backgroundColor: "black",
                    opacity: 0.4,
                    height: "100%",
                    width: "100%",
                    zIndex: -1
                }} ></div>
            {children}
        </div>
    )
}
