import React, {useEffect, useRef, useState} from 'react';
import Draggable, {DraggableData, DraggableEvent, DraggableEventHandler} from 'react-draggable';
import { Card, Button } from 'react-bootstrap';
import {ResizableBox, ResizeCallbackData} from 'react-resizable';
import validUrl from 'valid-url';
import {AssetCardProps} from "../models/AssetCardProps";

const AssetCard: React.FC<AssetCardProps> = ({ asset, index, onDelete, onResize, isPlaying }) => {
    const [width, setWidth] = useState(asset.width);
    const [height, setHeight] = useState(asset.height);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    const handleDrag: DraggableEventHandler = (e: DraggableEvent, data: DraggableData): void => {
        const newAsset = { ...asset };
        newAsset.x += data.deltaX;
        newAsset.y += data.deltaY;
        setWidth(newAsset.width);
        setHeight(newAsset.height);
    };

    const handleResize = (e: React.SyntheticEvent, data: ResizeCallbackData): void => {
        const aspectRatio = asset.width / asset.height;
        const newWidth = data.size.width;
        const newHeight = newWidth / aspectRatio;
        setWidth(newWidth);
        setHeight(newHeight);
        onResize(index, newWidth, newHeight);
    };

    const parentContainer: HTMLElement = document.querySelector('.canvas') as HTMLElement;
    const parentWidth = parentContainer ? parentContainer.offsetWidth : 0;
    const parentHeight = parentContainer ? parentContainer.offsetHeight : 0;
    const bounds = {
        left: 0,
        top: 0,
        right: parentWidth - width,
        bottom: parentHeight - height,
    };

    return (
        <Draggable handle=".draggable-asset"
                   bounds={bounds}
                   onDrag={handleDrag}>
            <ResizableBox
                width={width}
                height={height}
                onResize={handleResize}
                minConstraints={[100, 100]}
                maxConstraints={[500, 500]}
                style={{
                    position: 'absolute',
                    left: asset.x,
                    top: asset.y,
                }}
            >
                <Card className="draggable-asset h-100">
                    <div className="draggable-asset d-flex justify-content-between align-items-center">
                        Title
                        <Button className="delete-button btn-danger" onClick={() => onDelete(index)}>
                            <span aria-hidden="true">&times;</span>
                        </Button>
                    </div>

                    {validUrl.isWebUri(asset.url) && asset.url.endsWith('.mp4') ? (
                        <video controls width="100%" height="100%" ref={videoRef}>
                            <source src={asset.url} type="video/mp4"/>
                        </video>
                    ) : (
                        <div className="d-flex align-items-center justify-content-center overflow-hidden w-auto h-auto">
                            <img src={asset.url} alt={`Asset ${index + 1}`} className="object-fit-contain w-100 h-100"/>
                        </div>
                    )}
                </Card>
            </ResizableBox>
        </Draggable>
    );
};

export default AssetCard;
