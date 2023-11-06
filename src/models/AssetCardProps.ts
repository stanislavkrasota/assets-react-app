import {Asset} from "./Asset";

export interface AssetCardProps {
    asset: Asset;
    index: number;
    isPlaying: boolean;
    onDelete: (index: number) => void;
    onResize: (index: number, width: number, height: number) => void;
}
