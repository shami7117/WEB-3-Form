export default function ToggleButtons() {
    return (
        <div className="toggle-button">
            <label htmlFor="toggle-image">Modern</label>
            <input type="radio" name="preview-type" id="toggle-image" checked />
            <label htmlFor="toggle-square">Classic</label>
            <input type="radio" name="preview-type" id="toggle-square" />
        </div>
    );
}
