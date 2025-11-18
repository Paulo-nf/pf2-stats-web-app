import { Enemy } from "../interfaces";

interface EnemyCardProps {
    enemy: Enemy;
    isEnabled: boolean;
    onRemove: () => void;
    levelDifference: number;
    onLevelDifferenceChange: (value: number) => void;
    onEnemyUpdate: (updatedEnemy: Enemy) => void;
}

const EnemyCard = ({
    enemy,
    isEnabled,
    onRemove,
    levelDifference,
    onLevelDifferenceChange,
    onEnemyUpdate
}: EnemyCardProps) => {
    const { level, hp, ac, fort, reflex, will, attack_bonus, spell_dc, spell_attack_bonus, hasAdvantage, hasDisadvantage } = enemy;

    const handleVantageChange = (type: 'advantage' | 'disadvantage', value: boolean) => {
        const updatedEnemy = {
            ...enemy,
            hasAdvantage: type === 'advantage' ? value : false,
            hasDisadvantage: type === 'disadvantage' ? value : false
        };
        onEnemyUpdate(updatedEnemy);
    };

    const renderVantageInput = () => (
        <>
            <label className="inline-flex items-center mb-4 mr-4">
                <input
                    type="checkbox"
                    checked={hasAdvantage}
                    onChange={(e) => handleVantageChange('advantage', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    disabled={hasDisadvantage}
                />
                <span className="ml-2 font-bold">Advantage</span>
            </label>
            <label className="inline-flex items-center mb-4">
                <input
                    type="checkbox"
                    checked={hasDisadvantage}
                    onChange={(e) => handleVantageChange('disadvantage', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    disabled={hasAdvantage}
                />
                <span className="ml-2 font-bold">Disadvantage</span>
            </label>
        </>
    );

    return (
        <div className="flex border-2 border-gray-500 p-2 rounded-lg">
            <div className="bg-white p-6">
                <p><strong>Level:</strong> {level}</p>
                <p><strong>HP:</strong> {hp}</p>
                <p><strong>Armor Class:</strong> {ac}</p>
                <p><strong>Fortitude:</strong> +{fort}</p>
                <p><strong>Reflex:</strong> +{reflex}</p>
                <p><strong>Will:</strong> +{will}</p>
                <p><strong>Attack Bonus:</strong> +{attack_bonus}</p>
                <p><strong>Spell DC:</strong> {spell_dc}</p>
                <p><strong>Spell Attack Bonus:</strong> +{spell_attack_bonus}</p>
            </div>
            <div className="flex flex-col space-y-1">
                <button
                    onClick={onRemove}
                    className={`text-white px-4 py-2 rounded transition-colors`}
                    disabled={!isEnabled}
                >
                    Remove Enemy
                </button>

                <label className="block mb-4">
                    <strong>CR Difference</strong>:
                    <input
                        type="number"
                        value={levelDifference}
                        onChange={(e) => onLevelDifferenceChange(Number(e.target.value))}
                        className="ml-2 p-1 border rounded"
                    />
                </label>
                {renderVantageInput()}
            </div>
        </div>
    );
};

export default EnemyCard;
