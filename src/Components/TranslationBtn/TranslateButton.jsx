import React, { useState } from "react";
import translate from "google-translate-api";

const TranslateButton = () => {
    const [isTranslated, setIsTranslated] = useState(false);
    const [translatedContent, setTranslatedContent] = useState("");

    const handleTranslate = async () => {
        try {
            const textToTranslate = "Hello, world!"; // Example text to translate
            const translation = await translate(textToTranslate, {
                from: "en",
                to: "bn",
            }); // Translate English to Bengali
            setTranslatedContent(translation.text);
            setIsTranslated(true);
        } catch (error) {
            console.error("Translation error:", error);
        }
    };

    return (
        <div>
            <button onClick={handleTranslate}>Translate</button>
            {isTranslated && <div>Translated Content: {translatedContent}</div>}
        </div>
    );
};

export default TranslateButton;
