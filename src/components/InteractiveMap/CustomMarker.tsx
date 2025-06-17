import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
//import { PinIcon } from '@/components/Icons/PinIcon';
import { ReactNode } from 'react';
import { FaLocationPin } from "react-icons/fa6";

const CustomMarker = ({ position, popupText, color, onClick, onDblClick }: { position: [number, number], popupText: string | ReactNode, color?: string, onClick: (e?: any) => void, onDblClick?: (e?: any) => void }) => {
    const iconHtml = L.divIcon({
        html: ReactDOMServer.renderToString(<FaLocationPin size={'30px'} color={color} />),
        className: 'custom-icon',
        iconSize: [30, 30],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    return (
        <Marker position={position} icon={iconHtml} eventHandlers={{ click: onClick, dblclick: onDblClick }}>
            <>
                <Popup>{popupText}</Popup>
            </>
        </Marker>
    );
};

export default CustomMarker;
