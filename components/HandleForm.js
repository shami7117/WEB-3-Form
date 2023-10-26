import { useState, useEffect } from "react";
import * as punycode from 'punycode';
import { oortConfig } from '../oort-config';

import { Button, Modal, notification } from 'antd';



export default function HandleForm() {
    const [imageChecked, setImageChecked] = useState(true);
    const [handleInput, setHandleInput] = useState('');
    const [DisplayHandleInput, setDisplayHandleInput] = useState('');
    const [Button, setButton] = useState('Register Handle');
    const [yearsInput, setYearsInput] = useState(1);
    const [charCount, setCharCount] = useState(0);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isInscribeVisible, setIsInscribeVisible] = useState(false);
    const [isList, setIsList] = useState([]);
    const [isButtonVisible, setIsButtonVisible] = useState(false);


    const [subhandleMintButtonOn1, setSubhandleMintButtonOn] = useState(false);

    const handleSubhandleMintButtonClick = () => {
        setSubhandleMintButtonOn(!subhandleMintButtonOn1);
    };

    useEffect(() => {
        // Initialize the bot script
        window.__OORT__CONFIG__ = {
            agentId: oortConfig.agentId,
            secretKey: oortConfig.secretKey
        };

        // Load the bot script
        const script = document.createElement("script");
        script.src = "https://front.standard.us-east-1.oortech.com/line/agent/main.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup when the component unmounts
            document.body.removeChild(script);
        };
    }, []);
    const handleImageChange = () => {
        setImageChecked(true);
    };

    const handleSquareChange = () => {
        setImageChecked(false);
    };
    function checkYearsInputValidity(e) {
        const inputValue = e.target.value;
        setYearsInput(inputValue);

        if (inputValue === "" || isNaN(inputValue) || parseInt(inputValue, 10) < 1) {
            setIsInvalid(true);
        } else {
            setIsInvalid(false);
        }

        // if (isInvalid) {
        //     button.disabled = true;
        //     button.style.backgroundColor = "#ccc";
        //     document.quer{`Selector(".years-error" ${isInvalid?"block":"hidden"}`}.style.display = "block";
        // } else {
        //     button.style.backgroundColor = "#007BFF";
        //     document.quer{`Selector(".years-error" ${isInvalid?"block":"hidden"}`}.style.display = "none";
        // }
    }



    // Function to validate input (no changes)
    function validateInput(input) {
        return /^[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?(\.[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)?$/.test(input);
    }

    // Function to determine if it's a subhandle (no changes)
    function determineSubhandle(input) {
        return input.includes('.');
    }
    // Function to update character count and rBTC cost
    function updateCharacterCount() {
        const handleInput = document.getElementById("handle-input").value;
        const charCount = document.getElementById("char-count");
        const handlePreview = document.getElementById("handle-preview-text");
        const yearsInput = parseInt(document.getElementById("years-input").value, 10);

        const isSubhandle = determineSubhandle(handleInput);
        const cleanInput = handleInput.split(".")[0];

        let rBTC = 0;

        if (isSubhandle) {
            if (cleanInput.length === 1) {
                rBTC = 0.1;
            } else if (cleanInput.length === 2) {
                rBTC = 0.025;
            } else if (cleanInput.length === 3) {
                rBTC = 0.005;
            } else if (cleanInput.length === 4) {
                rBTC = 0.0025;
            } else {
                rBTC = 0.0001;
            }
        } else {
            if (cleanInput.length === 1) {
                rBTC = 1;
            } else if (cleanInput.length === 2) {
                rBTC = 0.25;
            } else if (cleanInput.length === 3) {
                rBTC = 0.015;
            } else if (cleanInput.length === 4) {
                rBTC = 0.005;
            } else {
                rBTC = 0.0001;
            }
        }

        const totalRBTC = rBTC * yearsInput;

        charCount.textContent = `${cleanInput.length} = `;
        const rBTCAmount = document.createElement("span");
        rBTCAmount.textContent = `${totalRBTC} rBTC`;
        rBTCAmount.style.color = "green"; // Set the color to green
        charCount.appendChild(rBTCAmount);
        // setCharCount(rBTCAmount);

        if (validateInput(handleInput)) {
            handlePreview.textContent = `${handleInput}.₿`;
            handlePreview.style.color = "white";
        } else {
            handlePreview.textContent = "Invalid input. Please use only lowercase letters, digits, dots, and hyphens, and ensure they are not at the beginning or end of the input.";
            handlePreview.style.color = "white";
        }

        placeholderPreview();
    }

    console.log("VALUE", DisplayHandleInput)
    console.log("input", handleInput)
    // Function to update button text and enable/disable based on input
    function placeholderPreview() {

        // const handleInput = document.getElementById("handle-input").value;
        const button = document.getElementById("manage-handle-button");
        // const handlePreview = document.getElementById("handle-preview-text");
        const yearsInput = document.getElementById("years-input").value;
        let isSubhandle = false; // Initialize isSubhandle as false

        // if (yearsInput === "0" || yearsInput.trim() === "" || isNaN(yearsInput)) {
        //     button.disabled = true;
        //     button.style.backgroundColor = "#ccc";
        //     document.quer{`Selector(".years-error" ${isInvalid?"block":"hidden"}`}.style.display = "block";
        // } else {
        //     button.style.backgroundColor = "#007BFF";
        //     document.quer{`Selector(".years-error" ${isInvalid?"block":"hidden"}`}.style.display = "none";
        // }

        // Check if the handle input contains a dot (.) indicating a subhandle
        if (handleInput.includes(".")) {
            isSubhandle = true; // Set isSubhandle to true for subhandles
            // button.textContent = "Register Subhandle";
            setButton("Register Subhandle")
        } else {
            isSubhandle = false;
            // button.textContent = "Register Handle";
            setButton("Register Handle")

        }

        // Check if the handle input is not blank and then proceed with validation
        if (handleInput.trim() !== "") {
            // Split the input by the dot (.) to handle Punycode decoding for each part separately
            const parts = handleInput.split(".");
            const decodedParts = parts.map((part) => {
                if (part.startsWith("xn--")) {
                    try {
                        // Use punycode library to decode Punycode to Unicode for Punycode parts
                        return punycode.toUnicode(part);
                    } catch (error) {
                        return "Invalid Punycode";
                    }
                } else {
                    return part;
                }
            });

            // Join the decoded parts back together with dots and display
            let decodedHandle = decodedParts[0]; // Initialize with the first part
            if (parts.length > 1) {
                decodedHandle += "." + decodedParts.slice(1).join("."); // Join the remaining parts
            }

            // Apply blue color to the text before the dot (.) for subhandles and decode Punycode
            if (isSubhandle) {
                const subhandleIndex = handleInput.indexOf(".");
                const subhandleText = handleInput.substring(0, subhandleIndex); // Get the part before the dot
                const remainingText = handleInput.substring(subhandleIndex);

                const decodedSubhandleText = punycode.toUnicode(decodedParts[0]);
                const decodedRemainingText = punycode.toUnicode(decodedParts.slice(1).join(".")); // Join the remaining decoded parts

                const decodedSubhandle = `${decodedSubhandleText}.`;
                setDisplayHandleInput(prevHandleInput => prevHandleInput + `${decodedSubhandle} ${decodedRemainingText}.₿`);

            } else {
                setDisplayHandleInput(prevHandleInput => prevHandleInput + `${decodedHandle}.₿`);
            }

            // Calculate Unicode character count for sizing (text and Unicode)
            const textCharacterCount = Array.from(decodedHandle).filter(c => c.length === 1).length;
            const unicodeCharacterCount = Array.from(decodedHandle).filter(c => c.length > 1).length;

            // Function to calculate font size with a maximum of 65 pixels and a minimum margin of 50 pixels from the orange square edge
            function calculateFontSize(textCharCount, unicodeCharCount) {
                const minMargin = 80; // Minimum margin in pixels
                const maxFontSize = 70; // Maximum font size in pixels
                const maxAllowedFontSize = Math.min(
                    maxFontSize,
                    Math.min(
                        (440 - minMargin) / (textCharCount + unicodeCharCount), // square's width
                        (380 - minMargin) / (textCharCount + unicodeCharCount)  // square's height
                    )
                );
                return maxAllowedFontSize + 'px';
            }

            // Set font size based on both text and Unicode character counts
            const fontSize = calculateFontSize(textCharacterCount, unicodeCharacterCount);
            // handlePreview.style.fontSize = fontSize;

            if (validateInput(handleInput)) {
                // handlePreview.style.color = "white";
                button.disabled = false;
            } else {
                button.textContent = "Register Handle";
                setDisplayHandleInput("Invalid input. Please use only lowercase letters, digits, dots, and hyphens, and ensure they are not at the beginning or end of the input.")

                // Set a consistent font size for the error message
                // handlePreview.style.fontSize = "16px";

                button.disabled = true;
                button.style.backgroundColor = "#ccc";
                // handlePreview.style.color = "white";
            }
        } else {
            // Handle input is blank, reset the button and error message
            button.textContent = "Register Handle";
            button.disabled = true;
            // button.style.backgroundColor = "#ccc";
            // handlePreview.textContent = "";
            setDisplayHandleInput("");
        }
    }


    function updateLivePreview() {
        const handleInput = document.getElementById("handle-input").value;
        const handlePreview = document.getElementById("handle-preview-text");
        const yearsInput = parseInt(document.getElementById("years-input").value, 10);
        const isSubhandle = determineSubhandle(handleInput);
        const cleanInput = handleInput.split(".")[0];
        const punycodeHandle = punycode.toASCII(cleanInput); // Convert to Punycode
        const charCount = punycodeHandle.length; // Count characters in Punycode handle

        let charCountDisplay;

        if (charCount <= 5) {
            charCountDisplay = isSubhandle ? "✪".repeat(charCount) : "★".repeat(charCount);
        } else {
            charCountDisplay = charCount > 18 ? '18' : charCount.toString();
        }

        setDisplayHandleInput(`${punycodeHandle}.₿`) // Display Punycode handle
        // handlePreview.style.color = "white";

        const handleText = document.getElementById("handle-text");
        if (charCount <= 5) {
            handleText.innerHTML = charCountDisplay.split('').map(char => `<div>${char}</div>`).join('');
        } else {
            handleText.textContent = charCountDisplay;
        }
        handleText.style.color = isSubhandle ? "white" : "white";

        const square = document.getElementById("square");
        square.style.backgroundColor = isSubhandle ? "#0074f2" : "transparent";

        placeholderPreview();
    }
    const handleInputClick = () => {
        if (handleInput === 'Renew Handle' || handleInput === 'Renew Subhandle') {
            setHandleInput('');
            setIsInscribeVisible(true);
        }
        // setIsInscribeVisible(true);
        // Show the "Inscribe Ordinal" button
        const inscribeButton = document.getElementById("inscribe-button");
        if (inscribeButton) {
            inscribeButton.style.display = "block";
        }

        updateLivePreview();
    };



    function updatePreviewOnItemClick(event) {
        const listItem = event.target;
        if (listItem.tagName === 'UL') {
            const handleText = listItem.textContent;
            console.log("TEXT", handleText)

            // Remove the ".₿" suffix and any dot preceding it
            let handleWithoutSuffix = handleText.replace(/\.₿$/, '');

            // Remove Punycode characters and brackets
            handleWithoutSuffix = handleWithoutSuffix.replace(/[\u2000-\u3300]+/g, ''); // Remove Punycode characters
            handleWithoutSuffix = handleWithoutSuffix.replace(/\([^)]*\)/g, ''); // Remove brackets and their content

            // Trim any leading or trailing spaces
            handleWithoutSuffix = handleWithoutSuffix.trim();

            const handleInput = document.getElementById("handle-input");
            handleInput.value = handleWithoutSuffix;

            // Update the live preview
            // updateCharacterCount();
            updateLivePreview();

            // Update the button text based on whether it's a handle or subhandle
            const button = document.getElementById("manage-handle-button");
            if (handleWithoutSuffix.includes('.')) {
                button.textContent = "Renew Subhandle";
                setButton("Renew Subhandle")
                // button.style.marginBottom = "20px";
            } else {
                button.textContent = "Renew Handle";
                setButton("Renew Subhandle")
                // button.style.marginBottom = "20px";
            }

            // Create and display the "Set Bitcoin Address" input and confirm button container
            if (!bitcoinAddressInputCreated) {
                createInputAndConfirmButton("bitcoin-address-input", "Set Bitcoin Address");
                bitcoinAddressInputCreated = true;
            }

            // Create and display the "Transfer Handle" input and confirm button container
            if (!transferHandleInputCreated) {
                createInputAndConfirmButton("transfer-handle-input", "Transfer Handle to Rootstock Address");
                transferHandleInputCreated = true;
            }
        }
    }



    const handleInputChange = (e) => {
        setDisplayHandleInput(e.target.value)
        updateCharacterCount();
        updateInputWithPunycode();
        setHandleInput(e.target.value);

        // updateButton();
        if (handleInput === 'Renew Handle' || handleInput === 'Renew Subhandle') {
            setHandleInput('');
            setIsInscribeVisible(true);
        }
        // updateInputWithPunycode
        updateLivePreview();
    };

    const yearsInputChange = (e) => {
        setYearsInput(parseInt(e.target.value, 10));
        updateCharacterCount();
        // updateButton();

    };


    const updateInputWithPunycode = () => {
        const convertedValue = convertUnicodeToPunycode(handleInput);
        setHandleInput(convertedValue);
    };

    const convertUnicodeToPunycode = (input) => {
        const parts = input.split(".");
        const convertedParts = parts.map((part) => {
            if (!part.startsWith("xn--")) {
                try {
                    return punycode.toASCII(part);
                } catch (error) {
                    return "Invalid Unicode";
                }
            }
            return part; // Already in Punycode format
        });
        return convertedParts.join(".");
    };

    const registerHandle = () => {
        if (validateInput(handleInput)) {
            const fullHandle = `${handleInput}.₿`;
            const isSubhandle = determineSubhandle(handleInput);

            const isPunycode = handleInput.includes("xn--");

            let displayHandle;
            if (isPunycode) {
                displayHandle = `(${punycode.toUnicode(handleInput)}.₿) ${fullHandle}`;
            } else {
                displayHandle = fullHandle;
            }

            if (isSubhandle) {
                notification.open({
                    duration: 2,

                    type: "success",
                    message: `Registering subhandle: ${displayHandle} for ${yearsInput} years`,
                    placement: "top"
                })

            } else {
                notification.open({
                    duration: 2,

                    type: "success",
                    message: `Registering handle: ${displayHandle} for ${yearsInput} years`,
                    placement: "top"
                })
            }
            isList.push(displayHandle)
            // You can update state or perform any additional actions here

            // Clear the input fields
            setHandleInput('');
            setYearsInput(1);
            setCharCount(0);

            // Show a success message
            // notification.open({
            //     duration: 2,

            //     type: "success",
            //     message: "Registration successful!",
            //     placement: "top"
            // })
        } else {

            notification.open({
                duration: 2,

                type: "error",
                message: "Invalid input. Please use only lowercase letters, digits, dots, and hyphens, and ensure they are not at the beginning or end of the input.",
                placement: "top"
            })
        }
    };


    function createInputAndConfirmButton(inputId, inputPlaceholder) {
        const input = document.createElement("input");
        input.type = "text";
        input.id = inputId;
        input.placeholder = inputPlaceholder;

        const confirmButtonContainer = document.createElement("div");
        confirmButtonContainer.style.display = "flex";

        const confirmButton = document.createElement("button");
        confirmButton.textContent = "Confirm";
        confirmButton.type = "button";
        confirmButton.style.marginBlockEnd = "10px";
        confirmButton.style.width = "100%";
        confirmButton.style.marginLeft = "10px";
        // confirmButton.style.marginBottom = "30px";

        // Add event listener to the confirm button for further actions
        confirmButton.addEventListener("click", function () {
            const inputValue = input.value;
            // Handle the input value as needed (e.g., save it, use it for something, etc.)
            alert(`${inputPlaceholder} set to: ${inputValue}`);
        });

        // Add the input and confirm button container to the form container
        const formContainer = document.querySelector(".form-container");
        confirmButtonContainer.appendChild(input);
        confirmButtonContainer.appendChild(confirmButton);
        formContainer.appendChild(confirmButtonContainer);

        // Add an event listener to remove the input and confirm button container when Handle input is focused
        const handleInput = document.getElementById("handle-input");
        handleInput.addEventListener("focus", function () {
            formContainer?.removeChild(confirmButtonContainer);
            if (inputId === "bitcoin-address-input") {
                bitcoinAddressInputCreated = false;
            } else if (inputId === "transfer-handle-input") {
                transferHandleInputCreated = false;
            }
        });
    }



    const handleInscribeClick = () => {
        // Handle the "Inscribe Ordinal" button click here
        // Add your logic to inscribe the ordinal
    };
    // Flag to track whether the Bitcoin Address input has been created
    let bitcoinAddressInputCreated = false;
    // Flag to track whether the Transfer Handle input has been created
    let transferHandleInputCreated = false;

    const handleListItemClick = (event) => {
        const listItem = event.target;

        console.log("LIST", listItem.tagName)
        if (listItem.tagName === 'LI') {
            const handleText = listItem.textContent;
            const handleWithoutSuffix = handleText.replace(/\.₿$/, '').replace(/[\u2000-\u3300]+/g, '').replace(/\([^)]*\)/g, '').trim();

            setHandleInput(handleWithoutSuffix);
            updateLivePreview();

            const isSubhandle = handleWithoutSuffix.includes('.');
            setIsInscribeVisible(isSubhandle);
        }


        // Create and display the "Set Bitcoin Address" input and confirm button container
        if (!bitcoinAddressInputCreated) {
            createInputAndConfirmButton("bitcoin-address-input", "Set Bitcoin Address");
            bitcoinAddressInputCreated = true;
        }

        // Create and display the "Transfer Handle" input and confirm button container
        if (!transferHandleInputCreated) {
            createInputAndConfirmButton("transfer-handle-input", "Transfer Handle to Rootstock Address");
            transferHandleInputCreated = true;
        }
    };
    console.log("INSCRIBE", isInscribeVisible)

    useEffect(() => {
        if (isInscribeVisible) {
            // createInscribeButton();
        }
    }, [isInscribeVisible]);

    function createInscribeButton() {
        const inscribeButton = document.createElement("button");
        inscribeButton.textContent = "Inscribe Ordinal";
        inscribeButton.style.position = "absolute";
        inscribeButton.style.right = "0px";
        inscribeButton.type = "button";
        inscribeButton.id = "inscribe-button"; // Add an ID to the button
        // inscribeButton.style.display = "none"; // Hide the button initially

        // Add an event listener to determine when the "Renew Handle" or "Renew Subhandle" button is present
        document.addEventListener("DOMSubtreeModified", function () {
            const renewButton = document.getElementById("manage-handle-button");
            console.log("RENEW", renewButton.textContent)
            if (renewButton && (renewButton.textContent === "Renew Handle" || renewButton.textContent === "Renew Subhandle")) {
                inscribeButton.style.display = "block"; // Display the button when needed
            } else {
                inscribeButton.style.display = "none"; // Hide the button otherwise
            }
        });

        // Add the "Inscribe Ordinal" button to the document body
        // document.body.appendChild(inscribeButton);

        const transferHandleInput = document.getElementById("transfer-handle-input");
        transferHandleInput.parentNode.insertBefore(inscribeButton, transferHandleInput.nextSibling);

        // Add an event listener to remove the "Inscribe Ordinal" button
        // inscribeButton.addEventListener("click", function () {
        //     transferHandleInput.parentNode.removeChild(inscribeButton);
        // });

        // Find the live preview (orange square) and place the button above it
        const livePreview = document.getElementById("square");
        if (livePreview) {
            livePreview.parentElement.insertBefore(inscribeButton, livePreview);
        }
    }



    const [isSubhandleMintButtonOn, setIsSubhandleMintButtonOn] = useState(false);
    const [isSubhandleMintButtonCreated, setIsSubhandleMintButtonCreated] = useState(false);

    // Variable to track the state of the "Subhandle Mint" button
    let subhandleMintButtonOn = false;
    let subhandleMintButtonCreated = false;


    const createSubhandleMintButton = () => {
        const subhandleMintButton = document.createElement("button");
        subhandleMintButton.textContent = "Subhandle Mint (Off)";
        subhandleMintButton.className = "SubhandleMint ";
        subhandleMintButton.type = "button";
        subhandleMintButton.style.position = "absolute";
        subhandleMintButton.style.bottom = "8px";
        subhandleMintButton.style.left = "30px";
        // subhandleMintButton.style.marginTop = "10px";
        subhandleMintButton.style.whiteSpace = "nowrap"
        subhandleMintButton.id = "subhandle-mint-button";

        // Add an event listener to toggle the "Subhandle Mint" button on and off
        subhandleMintButton.addEventListener("click", function () {
            if (subhandleMintButtonOn) {
                subhandleMintButton.textContent = "Subhandle Mint (Off)";
            } else {
                subhandleMintButton.textContent = "Subhandle Mint (On)";
            }
            subhandleMintButtonOn = !subhandleMintButtonOn;
        });

        // Add the "Subhandle Mint" button below Transfer Handle Input
        const transferHandleInput = document.getElementById("transfer-handle-input");
        transferHandleInput.parentNode.insertBefore(subhandleMintButton, transferHandleInput.nextSibling);
    };

    const removeSubhandleMintButton = () => {
        const subhandleMintButton = document.getElementById("subhandle-mint-button");
        if (subhandleMintButton) {
            subhandleMintButton.parentNode.removeChild(subhandleMintButton);
            subhandleMintButtonCreated = false;
        } (false);
    };





    const createActivateButton = () => {
        const activateButton = document.createElement("button");
        activateButton.textContent = "Activate zkERC-6551";
        activateButton.type = "button";
        activateButton.style.position = "absolute";
        activateButton.style.bottom = "8px";
        activateButton.style.left = "230px";
        activateButton.id = "activate-button";
        activateButton.style.display = "none"; // Initially hide the button

        // Add an event listener to toggle the button on and off
        activateButton.addEventListener("click", function () {
            // Your code to handle the "Activate zkERC-6551" button click event
        });

        // Add the "Activate zkERC-6551" button to the document body
        // document.body.transferHandleInput.appendChild(activateButton);

        // Add the "Subhandle Mint" button below Transfer Handle Input
        const transferHandleInput = document.getElementById("transfer-handle-input");
        transferHandleInput.parentNode.insertBefore(activateButton, transferHandleInput.nextSibling);
    };
    useEffect(() => {
        if (subhandleMintButtonOn) {

            // createActivateButton();
        }
    },);
    const observeManageHandleButtonChanges = () => {
        const manageHandleButton = document.getElementById("manage-handle-button");
        if (manageHandleButton) {
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                        const buttonText = mutation.addedNodes[0].textContent;
                        if (buttonText === "Renew Handle") {
                            // Show the "Subhandle Mint" button
                            // createSubhandleMintButton();
                            subhandleMintButtonCreated = true;

                            // Show the "Activate zkERC-6551" button
                            const activateButton = document.getElementById("activate-button");
                            if (activateButton) {
                                activateButton.style.display = "block";
                            }
                        } else if (buttonText === "Renew Subhandle") {
                            // Hide the "Subhandle Mint" button
                            // removeSubhandleMintButton();

                            // Show the "Activate zkERC-6551" button
                            const activateButton = document.getElementById("activate-button");
                            if (activateButton) {
                                activateButton.style.display = "block";
                            }
                        } else if (buttonText === "Register Handle" || buttonText === "Register Subhandle") {
                            // Hide the "Subhandle Mint" button
                            removeSubhandleMintButton();

                            // Hide the "Activate zkERC-6551" button
                            const activateButton = document.getElementById("activate-button");
                            if (activateButton) {
                                activateButton.style.display = "none";
                            }
                        }
                    }
                }
            });

            const observerConfig = { childList: true };
            observer.observe(manageHandleButton, observerConfig);
        }
    };
    const [isInscribeButtonVisible, setIsInscribeButtonVisible] = useState(false);

    useEffect(() => {
        // Add an event listener to determine when the "Renew Handle" or "Renew Subhandle" button is present
        const handleDOMSubtreeModified = () => {
            const renewButton = document.getElementById("manage-handle-button");
            if (renewButton && (renewButton.textContent === "Renew Handle" || renewButton.textContent === "Renew Subhandle")) {
                setIsInscribeButtonVisible(true);
            } else {
                setIsInscribeButtonVisible(false);
            }
        };

        document.addEventListener("DOMSubtreeModified", handleDOMSubtreeModified);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("DOMSubtreeModified", handleDOMSubtreeModified);
        };
    }, []);

    useEffect(() => {
        observeManageHandleButtonChanges();
    }, []);

    return (<div className="pt-[60px] ">
        <main className="max-w-[450px] relative  flex flex-col justify-start items-center">
            <h1 className="font-bold text-[32px]">HNDL Registrar</h1>
            <div className="h-[1px]"></div>


            <div className="preview-container w-full">
                <div className={`${imageChecked ? "preview-square" : "preview-square3"}`}>
                    <div className="handle-text" id="handle-text"></div>
                    <p class="handle-preview"><span id="handle-preview-text"></span></p>
                    <div id="square" className=" absolute top-[10px] left-[10px] w-[10px] h-[10px]"></div>

                </div>
            </div>
            <div className="flex justify-between gap-x-4 items-center self-end m-0">
                <label htmlFor="toggle-image">Modern</label>
                <input
                    type="radio"
                    name="preview-type"
                    id="toggle-image"
                    checked={imageChecked}
                    onChange={handleImageChange}
                />
                <label htmlFor="toggle-square">Classic</label>
                <input
                    type="radio"
                    name="preview-type"
                    id="toggle-square"
                    checked={!imageChecked}
                    onChange={handleSquareChange}
                />
            </div>

            <div className="form-container w-full  flex flex-col">
                <label htmlFor="handle-input">Your Web3 Handle:</label>
                <input
                    type="text"
                    id="handle-input"
                    placeholder="Handle or Subhandle"
                    maxLength="37"
                    value={handleInput}
                    onChange={handleInputChange}
                />
                <p className="text-[12px] char-count mt-[5px]">
                    Character count: <span id="char-count">{charCount}</span>
                </p>

                <div className="input-button-container">
                    <label htmlFor="years-input">Registration Years:</label>
                    <input
                        type="number"
                        id="years-input"
                        className="w-full mr-2 "
                        placeholder="1"
                        value={yearsInput}
                        min="1"
                        onChange={(e) => {
                            setYearsInput(e.target.value);
                            yearsInputChange(e);
                            checkYearsInputValidity(e);
                        }}
                    />
                    <p className={`text-[red] years-error  ${isInvalid ? "block" : "hidden"}`}></p>

                    <button
                        className={isInvalid || yearsInput === '' || isNaN(yearsInput) || parseInt(yearsInput, 10) < 1 ? "bg-[#007bff]" : "bg-[#007bff]"}
                        type="button"
                        id="manage-handle-button"
                        disabled={!validateInput(handleInput) || yearsInput === '' || isNaN(yearsInput) || parseInt(yearsInput, 10) < 1 || isInvalid}
                        onClick={registerHandle}
                    >
                        {Button}
                    </button>



                </div>


                <div className="grid grid-cols-2 mb-2 gap-x-4 ">
                    {isInscribeButtonVisible && <button
                        // onClick={handleActivateButtonClick}
                        style={{
                            // position: 'absolute',
                            // bottom: '8px',
                            // left: '230px',
                            // display: isButtonVisible ? 'block' : 'none',
                        }}
                        id="activate-button"
                        type="button"
                    >
                        Activate zkERC-6551
                    </button>}

                    {isInscribeButtonVisible && (
                        <button
                            onClick={() => {
                                // Handle the "Inscribe Ordinal" button click event
                            }}
                            style={{
                                // position: 'absolute',
                                // right: '0px',
                            }}
                            className="w-full "
                            id="inscribe-button"
                            type="button"
                        >
                            Inscribe Ordinal
                        </button>
                    )}

                </div>
                {
                    isInscribeButtonVisible && <button
                        onClick={handleSubhandleMintButtonClick}
                        className="SubhandleMint w-full "
                        style={{
                            // position: 'absolute',
                            // bottom: '8px',
                            // left: '30px',
                            // whiteSpace: 'nowrap',
                        }}
                        id="subhandle-mint-button"
                        type="button"
                    >
                        {subhandleMintButtonOn1 ? 'Subhandle Mint (On)' : 'Subhandle Mint (Off)'}
                    </button>
                }

            </div>
            <p className="invalid-message" id="error-message"></p>


        </main>

        <div class="my-handles absolute top-[100px] mt-[50px] mr-[80px] right-[100px]">
            <h2 className="font-bold">My Handles</h2>
            {isList.map((item) => {
                return <ul className="hover:bg-[#007bff] hover:text-[#fff] cursor-pointer p-1 rounded-[5px]" onClick={(e) => {
                    // 1 = true
                    handleInputClick();
                    updatePreviewOnItemClick(e);
                    handleListItemClick(e)
                    // createInscribeButton();
                    // createSubhandleMintButton();
                    // createActivateButton();
                }} id="my-handles-list text-[#000]">{item}
                </ul>
            })}

        </div>
    </div>
    );
}
