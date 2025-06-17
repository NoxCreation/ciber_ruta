import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { PinIcon } from '@/components/Icons/PinIcon';
import { ReactNode } from 'react';

const AddMarker = ({ position, popupText, color, onClick }: { position: [number, number], popupText: string | ReactNode, color?: string, onClick: (e?: any) => void }) => {
    const iconHtml = L.divIcon({
        html: ReactDOMServer.renderToString(<PinIcon color={color} />),
        className: 'custom-icon',
        iconSize: [30, 30],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    return (
        <Marker position={position} icon={iconHtml} eventHandlers={{ click: onClick }}>
            <>
                <Popup>{popupText}</Popup>
            </>
        </Marker>
    );
};

export default AddMarker;
