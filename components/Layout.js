import ToggleButtons from "./Toggle";
import HandleForm from "./HandleForm";
import ConfirmationModal from "./ConfirmationModal";
import HandlesList from "./HandleList";

export default function Layout() {
    return (
        <>
            {/* <h1>HNDL Registrar</h1>
            <div style={{ height: "1px" }}></div> */}
            {/* <ToggleButtons /> */}
            {/* <HandlesList /> */}
            <HandleForm />
            {/* <p className="invalid-message" id="error-message"></p>
            <button
                id="connect-wallet-button"
                style={{ position: "absolute", top: "20px", right: "20px" }}
            >
                Connect Wallet
            </button>
            <span id="connected-address" style={{ display: "none" }}></span>
             */}
            <ConfirmationModal />
        </>
    );
}
