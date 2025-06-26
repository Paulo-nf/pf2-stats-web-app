import React from "react";

interface PickShowTypeProps {
    value: string;
    onChange: (value: string) => void;
}

const PickShowType = ({ value, onChange }: PickShowTypeProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    return (
        <label className="flex items-center space-x-2">
            <span>Pick Average Type:</span>
            <select value={value} onChange={handleChange} className="ml-2 p-1 border rounded">
                <option value="1 player">1 Player, All enemies</option>
                <option value="simple calculator">Simple Calculator</option>
            </select>
        </label>
    );
};

export default PickShowType;
