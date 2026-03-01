import classData from "../data/class_data.json";
import { PlayerStatsCombided } from "../interfaces";

interface PlayerCardProps {
    player: PlayerStatsCombided;
    onUpdate: (updatedPlayer: PlayerStatsCombided) => void;
    onReset: () => void; // Add onReset prop
    onRemove: () => void; // Add onRemove prop
}

const PlayerCard = ({ player, onUpdate, onReset, onRemove }: PlayerCardProps) => {
    const {
        playerClass,
        playerLevel,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        itemBonusWeapon,
        itemArmor,
        itemBonusArmor,
        itemBonusSaves,
        itemDexCap,
        weaponStrike0,
        weaponStrike1,
        weaponStrike2,
        spellAttack,
        armorClass,
        fortitude,
        reflex,
        will,
        spellcastingAttr,
        hasAdvantage,
        hasDisadvantage,
    } = player;

    const handleInputChange = (field: keyof PlayerStatsCombided, value: string | number | boolean) => {
        onUpdate({ ...player, [field]: value });
    };

    const renderClassInput = () => (
        <label className="block mb-4">
            Pick a class:
            <select
                value={playerClass}
                onChange={(e) => handleInputChange("playerClass", e.target.value)}
                className="ml-2 p-1 border rounded"
            >
                {Object.keys(classData).map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>
        </label>
    );

    const renderLevelInput = () => (
        <label className="block mb-4">
            <strong>Player Level</strong>:
            <input
                type="number"
                min="1"
                max="20"
                value={playerLevel}
                onChange={(e) => handleInputChange("playerLevel", Number(e.target.value))}
                className="ml-2 p-1 border rounded"
            />
        </label>
    );

    const renderAttributeInput = (label: string, field: keyof PlayerStatsCombided, value: number) => (
        <label className="block mb-4">
            <strong>{label}</strong>:
            <input
                type="number"
                min="-9"
                max="9"
                value={value}
                onChange={(e) => handleInputChange(field, Number(e.target.value))}
                className="ml-2 p-1 border rounded"
            />
        </label>
    );

    const renderItemInput = (label: string, field: keyof PlayerStatsCombided, value: number) => (
        <label className="block mb-4">
            <strong>{label}</strong>:
            <input
                type="number"
                min="1"
                max="20"
                value={value}
                onChange={(e) => handleInputChange(field, Number(e.target.value))}
                className="ml-2 p-1 border rounded"
            />
        </label>
    );

    const renderVantageInput = () => (
        <>
            <label className="inline-flex items-center mb-4 mr-4">
                <input
                    type="checkbox"
                    checked={hasAdvantage}
                    onChange={(e) => handleInputChange("hasAdvantage", e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    disabled={hasDisadvantage}
                />
                <span className="ml-2 font-bold">Advantage</span>
            </label>
            <label className="inline-flex items-center mb-4">
                <input
                    type="checkbox"
                    checked={hasDisadvantage}
                    onChange={(e) => handleInputChange("hasDisadvantage", e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    disabled={hasAdvantage}
                />
                <span className="ml-2 font-bold">Disadvantage</span>
            </label>
        </>
    );

    const renderSpellcastingAttrInput = () => (
        <label className="block mb-4">
        <strong>Spellcasting Modifier</strong>:
        <select
        value={spellcastingAttr}
        onChange={(e) => handleInputChange("spellcastingAttr", e.target.value)}
        className="ml-2 p-1 border rounded"
        >
        <option value="intelligence">Intelligence</option>
        <option value="wisdom">Wisdom</option>
        <option value="charisma">Charisma</option>
        </select>
        </label>
    );

    return (
        <div className="flex flex-col md:flex-row bg-white rounded-lg p-6 space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex flex-col space-y-2">
                <button
                    onClick={onReset}
                    className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                    Reset Player
                </button>
                <button
                    onClick={onRemove}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Remove Player
                </button>
            </div>
            <div className="flex-1">
                {renderClassInput()}
                {renderLevelInput()}
                {renderAttributeInput("Strength", "strength", strength)}
                {renderAttributeInput("Dexterity", "dexterity", dexterity)}
                {renderAttributeInput("Constitution", "constitution", constitution)}
                {renderAttributeInput("Intelligence", "intelligence", intelligence)}
                {renderAttributeInput("Wisdom", "wisdom", wisdom)}
                {renderAttributeInput("Charisma", "charisma", charisma)}
                {renderItemInput("Item Bonus (Weapon)", "itemBonusWeapon", itemBonusWeapon)}
                {renderItemInput("Armor", "itemArmor", itemArmor)}
                {renderItemInput("Item Bonus (Armor)", "itemBonusArmor", itemBonusArmor)}
                {renderItemInput("Item Bonus (Saves)", "itemBonusSaves", itemBonusSaves)}
                {renderItemInput("Dex Cap", "itemDexCap", itemDexCap)}
                {renderSpellcastingAttrInput()}
                {renderVantageInput()}
            </div>
            <div className="flex-1">
                <p><strong>Weapon Strike (1st):</strong> +{weaponStrike0}</p>
                <p><strong>Weapon Strike (2nd):</strong> +{weaponStrike1}</p>
                <p><strong>Weapon Strike (3rd):</strong> +{weaponStrike2}</p>
                <p><strong>Spell Attack:</strong> +{spellAttack}</p>
                <p><strong>Armor Class:</strong> {armorClass}</p>
                <p><strong>Fortitude:</strong> +{fortitude}</p>
                <p><strong>Reflex:</strong> +{reflex}</p>
                <p><strong>Will:</strong> +{will}</p>
            </div>
        </div>
    );
};

export default PlayerCard;
