// src/Components/BarcodeGenerator/UseBarcodeGenerator.jsx
import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const UseBarcodeGenerator = (value) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            JsBarcode(canvasRef.current, value, {
                format: "CODE128",
                lineColor: "#000",
                width: 2,
                height: 100,
                displayValue: true
            });
        }
    }, [value]);

    return { canvasRef };
};

export default UseBarcodeGenerator;
