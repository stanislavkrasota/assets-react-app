import React, { useState, useRef } from 'react';
import {Button, Form, Col, Row, FormControlProps} from 'react-bootstrap';
import validUrl from 'valid-url';
import AssetCard from "./components/AssetCard";
import {AssetsUrls, availableAssetFormats} from "./app-constants";
import {Asset} from "./models/Asset";
import {ResizableBox} from "react-resizable";


const App: React.FC = () => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = React.createRef<ResizableBox>();

  const [url, setUrl] = useState<string>(AssetsUrls[0]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [canvasArea, setCanvasArea] = useState<{width: number, height: number}>({width: mainRef.current?.offsetWidth ?? 800, height: 500});

  const handleAddAsset = (): void => {
    if (isValidUrl(url) && url?.length) {
      const newAsset: Asset = new Asset(url);
      setAssets([...assets, newAsset]);
      setUrl('');
    }
  };


  const handleDeleteAsset = (index: number) => {
    const updatedAssets: Asset[] = [...assets];
    updatedAssets.splice(index, 1);
    setAssets(updatedAssets);
  };

  const handleGlobalPlayback = (): void => {
    setIsPlaying(!isPlaying);
  };


  const handleResizeChange = (index: number, w: number, h: number) => {
    const updatedAssets = [...assets];
    const updatedAsset = { ...updatedAssets[index] };
    updatedAsset.width = w;
    updatedAsset.height = h;
    updatedAssets[index] = updatedAsset;
    setAssets(updatedAssets);
  }

  const isValidUrl = (url: string): boolean => {
    if (url?.length > 0) {
      const isFormatValid = availableAssetFormats.some(format => url.endsWith(format));
      return !!validUrl.isWebUri(url) && isFormatValid;
    } else {
      return true;
    }
  }

  return (
      <div className={'container p-5'} ref={mainRef}>
        <Form >
          <Row>
            <Col xs={8}>
              <Form.Group controlId="formUrl">
                <Form.Control
                    className={'w-100 mb-3'}
                    type="text"
                    placeholder="Enter a valid URL"
                    value={url}
                    isInvalid={!isValidUrl(url)}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <Form.Control.Feedback type="invalid">
                  Please enter a valid URL.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formSelect">
                <Form.Label>For testing use</Form.Label>
                <Form.Select className={'mb-3'} aria-label="Choose for test"
                             defaultValue={AssetsUrls[0]}
                             onChange={(e) => {setUrl(e.target.value)}}>
                  {AssetsUrls.map((url, index) => (
                      <option key={index} value={url}>{url}</option>
                  ))
                  }
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Button className={'me-2'} onClick={handleAddAsset}>Add Asset</Button>
              <Button className={'bg-dark'} onClick={handleGlobalPlayback}>Global Play/Pause</Button>
            </Col>

          </Row>
        </Form>

        <ResizableBox width={canvasArea.width} height={canvasArea.height}  minConstraints={[300, 500]}
                      maxConstraints={[Infinity, Infinity]} onResize={(e, data) => setCanvasArea({width: data.size.width, height: data.size.height})}
                      ref={canvasRef} className="canvas position-relative border border-dark-subtle rounded p-3"
        >
          <>
            {assets.map((asset: Asset, index: number) => (
                <AssetCard key={index} asset={asset} index={index} onDelete={handleDeleteAsset} isPlaying={isPlaying}
                           onResize={handleResizeChange}/>
            ))}
          </>
        </ResizableBox>

      </div>
  );
};


export default App;
