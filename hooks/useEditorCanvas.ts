"use client";

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { PrintArea, CanvasDesignState } from '@/types/editor';

interface UseEditorCanvasProps {
    printArea: PrintArea | undefined;
    canvasSize?: { width: number, height: number };
    onSelectionChange?: (activeObject: fabric.Object | null) => void;
    initialState?: CanvasDesignState;
    viewId?: string;
}

export function useEditorCanvas({ printArea, canvasSize, onSelectionChange, initialState, viewId }: UseEditorCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [canvasRevision, setCanvasRevision] = useState(0);

    const onSelectionChangeRef = useRef(onSelectionChange);
    useEffect(() => {
        onSelectionChangeRef.current = onSelectionChange;
    }, [onSelectionChange]);

    // Initialize canvas
    useEffect(() => {
        if (!canvasRef.current) return;

        // Create Fabric canvas
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            preserveObjectStacking: true, // Crucial for z-index management
            selection: true, // Allow multi-selection
            backgroundColor: 'transparent',
        });

        // Default settings for objects
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = '#16a34a'; // Primary color
        fabric.Object.prototype.cornerStyle = 'circle';
        fabric.Object.prototype.borderColor = '#16a34a';
        fabric.Object.prototype.cornerSize = 10;
        fabric.Object.prototype.padding = 5;

        // Custom Delete Control
        const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23ef4444;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.245' height='262.187'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.244' height='262.187'/%3E%3C/g%3E%3C/svg%3E";
        const img = document.createElement('img');
        img.src = deleteIcon;

        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetY: -16,
            offsetX: 16,
            cursorStyle: 'pointer',
            mouseUpHandler: (eventData, transform) => {
                const target = transform.target;
                const canvas = target.canvas;
                if (canvas) {
                    canvas.remove(target);
                    canvas.requestRenderAll();
                }
                return true;
            },
            render: (ctx, left, top, styleOverride, fabricObject) => {
                const size = 20;
                ctx.save();
                ctx.translate(left, top);
                ctx.drawImage(img, -size/2, -size/2, size, size);
                ctx.restore();
            },
            cornerSize: 20
        });

        // Event listeners for selection
        newCanvas.on('selection:created', () => onSelectionChangeRef.current?.(newCanvas.getActiveObject() || null));
        newCanvas.on('selection:updated', () => onSelectionChangeRef.current?.(newCanvas.getActiveObject() || null));
        newCanvas.on('selection:cleared', () => onSelectionChangeRef.current?.(null));

        setCanvas(newCanvas);

        return () => {
            newCanvas.dispose();
            setCanvas(null);
        };
    }, []);

    // Resize canvas when print area changes
    useEffect(() => {
        if (canvas && printArea) {
            // If canvasSize is provided, the canvas covers the full mockup, and printArea is just a clipping mask
            const useFullCanvas = !!canvasSize;
            canvas.setWidth(useFullCanvas ? canvasSize.width : printArea.width);
            canvas.setHeight(useFullCanvas ? canvasSize.height : printArea.height);

            if (useFullCanvas) {
                // Apply Clipping Mask so elements hide outside the chest bounding box
                const clipPath = new fabric.Rect({
                    left: printArea.left,
                    top: printArea.top,
                    width: printArea.width,
                    height: printArea.height,
                    absolutePositioned: true
                });
                canvas.clipPath = clipPath;
                
                // Optional: Draw a visual dashed bounding box for the print area that doesn't export
                // We'll skip drawing lines directly on canvas to keep export clean, we rely on HTML or overlay instead.
            }

            canvas.renderAll();
        }
    }, [canvas, printArea, canvasSize]);

    // Handle restoring state (if we switch views and come back)
    useEffect(() => {
        if (canvas && initialState && initialState.objects) {
            canvas.clear();
            canvas.setBackgroundColor('transparent', () => { });
            // Load from JSON
            fabric.util.enlivenObjects(initialState.objects, (objects: fabric.Object[]) => {
                objects.forEach((obj) => {
                    canvas.add(obj);
                });
                canvas.renderAll();
            }, "");
        } else if (canvas && !initialState) {
            canvas.clear();
            canvas.setBackgroundColor('transparent', () => { });
        }
    }, [canvas, initialState, viewId]);

    const addText = (textStr = 'Double click to edit', options: fabric.ITextOptions = {}) => {
        if (!canvas || !printArea) return;

        const centerX = canvasSize ? printArea.left + printArea.width / 2 : printArea.width / 2;
        const centerY = canvasSize ? printArea.top + printArea.height / 2 : printArea.height / 2;

        const text = new fabric.IText(textStr, {
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            fontFamily: 'sans-serif',
            fontSize: 32,
            fill: '#000000',
            fontWeight: 'bold',
            textAlign: 'center',
            ...options
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const addCurvedText = () => {
        if (!canvas || !printArea) return;
        const centerX = canvasSize ? printArea.left + printArea.width / 2 : printArea.width / 2;
        const centerY = canvasSize ? printArea.top + printArea.height / 2 : printArea.height / 2;
        
        // Use a path for text to curve along
        const path = new fabric.Path('M -100 0 Q 0 -100 100 0', { fill: '', stroke: '', objectCaching: false, visible: false });
        
        const text = new fabric.IText('CURVED TEXT', {
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            fontFamily: 'sans-serif',
            fontSize: 30,
            fill: '#000000',
            fontWeight: 'bold',
            textAlign: 'center',
            path: path
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const addShape = (type: string) => {
        if (!canvas || !printArea) return;

        const centerX = canvasSize ? printArea.left + printArea.width / 2 : printArea.width / 2;
        const centerY = canvasSize ? printArea.top + printArea.height / 2 : printArea.height / 2;

        const commonProps = {
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            fill: '#000000',
        };

        let shape: fabric.Object | null = null;

        switch (type) {
            case 'square':
                shape = new fabric.Rect({ ...commonProps, width: 100, height: 100 });
                break;
            case 'circle':
                shape = new fabric.Circle({ ...commonProps, radius: 50 });
                break;
            case 'triangle':
                shape = new fabric.Triangle({ ...commonProps, width: 100, height: 100 });
                break;
            case 'line':
                shape = new fabric.Line([-50, 0, 50, 0], { ...commonProps, stroke: '#000000', strokeWidth: 5, fill: '' });
                break;
            case 'star':
                shape = new fabric.Path('M 50 5 L 61 37 L 95 37 L 67 57 L 78 89 L 50 69 L 22 89 L 33 57 L 5 37 L 39 37 Z', commonProps);
                break;
            case 'heart':
                shape = new fabric.Path('M 50 85 C 20 55 5 35 5 20 C 5 5 25 5 35 15 C 45 25 50 30 50 30 C 50 30 55 25 65 15 C 75 5 95 5 95 20 C 95 35 80 55 50 85 Z', commonProps);
                break;
            case 'hexagon':
                shape = new fabric.Polygon([{x: 50, y: 0}, {x: 100, y: 25}, {x: 100, y: 75}, {x: 50, y: 100}, {x: 0, y: 75}, {x: 0, y: 25}], commonProps);
                break;
            case 'pentagon':
                shape = new fabric.Polygon([{x: 50, y: 0}, {x: 100, y: 38}, {x: 82, y: 100}, {x: 18, y: 100}, {x: 0, y: 38}], commonProps);
                break;
            case 'diamond':
                shape = new fabric.Polygon([{x: 50, y: 0}, {x: 100, y: 50}, {x: 50, y: 100}, {x: 0, y: 50}], commonProps);
                break;
            case 'arrow':
                shape = new fabric.Path('M 0 40 L 60 40 L 60 20 L 100 50 L 60 80 L 60 60 L 0 60 Z', commonProps);
                break;
            case 'cross':
                shape = new fabric.Path('M 35 0 L 65 0 L 65 35 L 100 35 L 100 65 L 65 65 L 65 100 L 35 100 L 35 65 L 0 65 L 0 35 L 35 35 Z', commonProps);
                break;
            case 'badge':
                shape = new fabric.Path('M 50 0 L 80 10 L 100 40 L 90 70 L 50 100 L 10 70 L 0 40 L 20 10 Z', commonProps);
                break;
        }

        if (shape) {
            canvas.add(shape);
            canvas.setActiveObject(shape);
            canvas.renderAll();
        }
    };

    const addImage = (url: string) => {
        if (!canvas || !printArea) return;

        fabric.Image.fromURL(url, (img) => {
            // Scale down image if it's too large for the print area
            const maxWidth = printArea.width * 0.8;
            const maxHeight = printArea.height * 0.8;

            if (img.width! > maxWidth || img.height! > maxHeight) {
                const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!);
                img.scale(scale);
            }

            const centerX = canvasSize ? printArea.left + printArea.width / 2 : printArea.width / 2;
            const centerY = canvasSize ? printArea.top + printArea.height / 2 : printArea.height / 2;

            img.set({
                left: centerX,
                top: centerY,
                originX: 'center',
                originY: 'center',
            });

            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
        });
    };

    const deleteSelected = () => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
            canvas.discardActiveObject();
            activeObjects.forEach((object) => {
                canvas.remove(object);
            });
            canvas.renderAll();
        }
    };

    const bringForward = () => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringForward(activeObject);
            canvas.renderAll();
        }
    };

    const sendBackward = () => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.sendBackwards(activeObject);
            canvas.renderAll();
        }
    };

    const updateActiveObject = (updates: Record<string, any>) => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set(updates);
            canvas.renderAll();
            // Force React re-render without unmounting the toolbar
            setCanvasRevision(r => r + 1);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!canvas) return;
            const activeObject = canvas.getActiveObject();
            if (!activeObject) return;

            // Don't trigger if user is editing text
            if (activeObject instanceof fabric.IText && activeObject.isEditing) {
                return;
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                deleteSelected();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canvas]);

    return {
        canvasRef,
        canvas,
        addText,
        addCurvedText,
        addShape,
        addImage,
        deleteSelected,
        bringForward,
        sendBackward,
        updateActiveObject,
        canvasRevision
    };
}
