"use client";

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { PrintArea, CanvasDesignState } from '@/types/editor';

interface UseEditorCanvasProps {
    printArea: PrintArea | undefined;
    canvasSize?: { width: number, height: number };
    onSelectionChange?: (activeObject: fabric.Object | null) => void;
    initialState?: CanvasDesignState;
}

export function useEditorCanvas({ printArea, canvasSize, onSelectionChange, initialState }: UseEditorCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

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
    }, [canvas, initialState]);

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
            // Force React re-render by creating a new reference or just triggering the callback
            onSelectionChangeRef.current?.(null);
            setTimeout(() => onSelectionChangeRef.current?.(activeObject), 0);
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
        addImage,
        deleteSelected,
        bringForward,
        sendBackward,
        updateActiveObject
    };
}
