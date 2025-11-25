import React, { useState } from 'react';

type ButtonConfig = {
    label: string;
    value: string;
};

type SelectionActionProps = {
    buttons: ButtonConfig[]; // Array of buttons to be rendered
    defaultActive?: string;
};

const SelectionAction: React.FC<SelectionActionProps> = ({ buttons, defaultActive }) => {
    const [activeButton, setActiveButton] = useState(defaultActive || buttons[0].value);

    const handleButtonClick = (buttonValue: string) => {
        setActiveButton(buttonValue);
    };

    return (
        <div className="btn-group" role="group" aria-label="Selection buttons">
            {buttons.map((button) => (
                <button key={button.value} type="button" className={`btn pt-1 pb-1 ${activeButton === button.value ? 'btn-primary' : 'btn-secondary border'}`} onClick={() => handleButtonClick(button.value)}>
                    {button.label}
                </button>
            ))}
        </div>
    );
};

export default SelectionAction;
