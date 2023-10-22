import React, { useState } from 'react';

function ConfirmationModal() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                if (walletConnected) {
                    // If already connected, show confirmation modal before disconnecting
                    setShowConfirmationModal(true);
                } else {
                    // Request Metamask to connect
                    await window.ethereum.request({ method: 'eth_requestAccounts' });

                    // Check if connected and get the selected address
                    if (window.ethereum.selectedAddress) {
                        setWalletConnected(true);

                        // Display the connected address with anonymity
                        const connectedAddress = window.ethereum.selectedAddress;
                        alert(`Connected to MetaMask with address: ${connectedAddress}`);

                        // You can perform further operations with the connected wallet here.
                    }
                }
            } catch (error) {
                console.error('Wallet connection error:', error);
            }
        } else {
            alert('MetaMask not detected. Please install or enable MetaMask extension.');
        }
    };

    const disconnectWallet = () => {
        // Perform any necessary wallet disconnection actions here
        setWalletConnected(false);
        setShowConfirmationModal(false);
        alert("Wallet disconnected");
    };

    return (
        <div>
            <button
                id="connect-wallet-button"
                style={{ position: 'absolute', top: '20px', right: '20px' }}
                onClick={connectWallet}
            >
                {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>

            {walletConnected && (
                <span id="connected-address">
                    Address connected: {window.ethereum.selectedAddress.slice(0, 5) + '...' + window.ethereum.selectedAddress.slice(-4)}
                </span>
            )}

            <div
                id="confirmation-modal"
                className="modal"
                style={{ display: showConfirmationModal ? 'block' : 'none' }}
            >
                <div className="modal-content">
                    <p>Do you want to disconnect your wallet?</p>
                    <div>
                        <button id="confirm-disconnect" onClick={disconnectWallet}>
                            Yes
                        </button>
                        <button id="cancel-disconnect" onClick={() => setShowConfirmationModal(false)}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
