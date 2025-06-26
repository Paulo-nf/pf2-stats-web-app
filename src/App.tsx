import { useState, useEffect } from "react";
import "./index.css";
import PlayerCard from "./components/PlayerCard";
import EnemyCard from "./components/EnemyCard";
import RatesCard from "./components/RatesCard";
import PickAverageType from "./components/PickAverageType";
import PickShowType from "./components/PickShowType";
import PWLCheckbox from "./components/PWLCheckbox";
import classData from "./data/class_data.json";
import enemyData from "./data/enemy_data.json";
import { Player, PlayerStats, PlayerStatsCombided, Enemy, EnemyAveragesJson } from "./interfaces";

const initialPlayer: Player = {
    playerClass: "Animist",
    playerLevel: 1,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    itemBonusWeapon: 0,
    itemArmor: 0,
    itemBonusArmor: 0,
    itemBonusSaves: 0,
    itemDexCap: 0,
    hasAdvantage: false,
    hasDisadvantage: false,
};

const getInitialEnemy = (playerLevel: number, averageType: string, pwl: boolean): Enemy => {
    const baseStats = getEnemyStats(playerLevel, averageType, pwl);
    return {
        ...baseStats,
        hasAdvantage: false,
        hasDisadvantage: false
    };
};

const calculatePlayerStats = (player: Player, pwl: boolean): PlayerStats => {
    const { playerClass, playerLevel, strength, dexterity, constitution, wisdom, charisma, itemBonusWeapon, itemArmor, itemBonusArmor, itemBonusSaves, itemDexCap } = player;
    const key = playerClass;
    const proficiencies = classData[key as keyof typeof classData]["proficiencies"][playerLevel - 1];
    enum ProficiencyEnum {
        WEAPON_ROLL = 0,
        SPELL = 1,
        AC = 2,
        FORTITUDE = 3,
        REFLEX = 4,
        WILL = 5,
    }
    const saveSpecializations = classData[key as keyof typeof classData]["saveSpecialization"]

    const levelBonus = pwl ? 0 : playerLevel;

    const calculateSaveLevel = (level: number, [threshold1, threshold2]: [number, number]): number => {
        if (level >= threshold2) return 2;
        if (level >= threshold1) return 1;
        return 0;
    };

    return {
        weaponStrike0: proficiencies[ProficiencyEnum.WEAPON_ROLL] + strength + itemBonusWeapon + levelBonus,
        weaponStrike1: proficiencies[ProficiencyEnum.WEAPON_ROLL] + strength + itemBonusWeapon - 5 + levelBonus,
        weaponStrike2: proficiencies[ProficiencyEnum.WEAPON_ROLL] + strength + itemBonusWeapon - 10 + levelBonus,
        spellAttack: proficiencies[ProficiencyEnum.SPELL] ? proficiencies[1] + charisma + levelBonus : 0,
        armorClass: proficiencies[ProficiencyEnum.AC] + 10 + Math.min(dexterity, itemDexCap) + itemArmor + itemBonusArmor + levelBonus,
        fortitude: proficiencies[ProficiencyEnum.FORTITUDE] + constitution + itemBonusSaves + levelBonus,
        reflex: proficiencies[ProficiencyEnum.REFLEX] + dexterity + itemBonusSaves + levelBonus,
        will: proficiencies[ProficiencyEnum.WILL] + wisdom + itemBonusSaves + levelBonus,

        saveSpecializationsLevels: {
            fort: calculateSaveLevel(playerLevel, saveSpecializations["fort"] as [number, number]),
            reflex: calculateSaveLevel(playerLevel, saveSpecializations["reflex"] as [number, number]),
            will: calculateSaveLevel(playerLevel, saveSpecializations["will"] as [number, number]),
        },
    };
};

const getEnemyStats = (level: number, averageType: string, pwl: boolean): Enemy => {
    const realAverageType = pwl ? `${averageType}_pwl` : averageType;
    const typedEnemyData: EnemyAveragesJson = enemyData as EnemyAveragesJson;

    try {
        if (!typedEnemyData[String(level)]) {
            throw new Error(`No data for level ${level}`);
        }

        const levelData = typedEnemyData[String(level)];
        if (!levelData[realAverageType]) {
            throw new Error(`No ${realAverageType} data for level ${level}`);
        }

        const data = levelData[realAverageType];

        return {
            level: level,
            hp: data.hp,
            ac: data.ac,
            fort: data.fort,
            reflex: data.reflex,
            will: data.will,
            attack_bonus: data.attack_bonus,
            spell_dc: data.spell_dc,
            spell_attack_bonus: data.spell_attack_bonus,
            hasAdvantage: false,
            hasDisadvantage: false
        };
    } catch (error) {
        console.error('Error loading enemy data:', error);

        return {
            level: level,
            hp: 0,
            ac: 0,
            fort: 0,
            reflex: 0,
            will: 0,
            attack_bonus: 0,
            spell_dc: 0,
            spell_attack_bonus: 0,
            hasAdvantage: false,
            hasDisadvantage: false
        };
    }
};

export default function App() {
    const [players, setPlayers] = useState<(PlayerStatsCombided)[]>([{ ...initialPlayer, ...calculatePlayerStats(initialPlayer, false) }]);
    const [enemies, setEnemies] = useState<Enemy[]>([getInitialEnemy(initialPlayer.playerLevel, "mean", false)]);
    const [averageType, setAverageType] = useState<string>("mean");
    const [showType, setShowType] = useState<string>("1 player");
    const [proficiencyWithoutLevel, setProficiencyWithoutLevel] = useState<boolean>(false);
    const [levelDifferences, setLevelDifferences] = useState<number[]>([0]);
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number>(0);

    useEffect(() => {
        setPlayers((players) =>
            players.map((player) => ({
                ...player,
                ...calculatePlayerStats(player, proficiencyWithoutLevel),
            }))
        );
    }, [proficiencyWithoutLevel]);

    useEffect(() => {
        if (players.length > 0) {
            const selectedPlayerLevel = players[selectedPlayerIndex].playerLevel;
            const updatedEnemies = enemies.map((_, index) =>
                getEnemyStats(selectedPlayerLevel + (levelDifferences[index] || 0), averageType, proficiencyWithoutLevel)
            );
            setEnemies(updatedEnemies);
        }
    }, [averageType, proficiencyWithoutLevel, players, levelDifferences, selectedPlayerIndex]);

    const handleLevelDifferenceChange = (index: number, value: number) => {
        setLevelDifferences((prev) => {
            const newDifferences = [...prev];
            newDifferences[index] = value;
            return newDifferences;
        });
    };

    const addEnemy = () => {
        if (players.length > 0) {
            const selectedPlayerLevel = players[selectedPlayerIndex].playerLevel;
            const newEnemy = getInitialEnemy(selectedPlayerLevel, averageType, proficiencyWithoutLevel);
            setEnemies((enemies) => [...enemies, newEnemy]);
            setLevelDifferences((prev) => [...prev, 0]);
        }
    };

    const updateEnemy = (index: number, updatedEnemy: Enemy) => {
        setEnemies(prev => {
            const newEnemies = [...prev];
            newEnemies[index] = updatedEnemy;
            return newEnemies;
        });
    };

    const handleRemoveEnemy = (index: number) => {
        setEnemies((prevEnemies) => prevEnemies.filter((_, i) => i !== index));
        setLevelDifferences((prev) => prev.filter((_, i) => i !== index));
    };

    const updatePlayer = (index: number, updatedPlayer: Player) => {
        setPlayers((players) => {
            const newPlayers = [...players];
            newPlayers[index] = { ...updatedPlayer, ...calculatePlayerStats(updatedPlayer, proficiencyWithoutLevel) };
            return newPlayers;
        });
    };

    const resetPlayer = (index: number) => {
        const newPlayer = { ...initialPlayer, ...calculatePlayerStats(initialPlayer, proficiencyWithoutLevel) };
        setPlayers((players) => players.map((player, i) => (i === index ? newPlayer : player)));
    };

    const removePlayer = (index: number) => {
        if (players.length === 1) {
            const newPlayer = { ...initialPlayer, ...calculatePlayerStats(initialPlayer, proficiencyWithoutLevel) };
            setPlayers([newPlayer]);
            setSelectedPlayerIndex(0);
        } else {
            setPlayers((players) => players.filter((_, i) => i !== index));
            if (index === selectedPlayerIndex) {
                setSelectedPlayerIndex(0);
            } else if (index < selectedPlayerIndex) {
                setSelectedPlayerIndex(selectedPlayerIndex - 1);
            }
        }
    };

    const addPlayer = () => {
        const newPlayer = { ...initialPlayer, ...calculatePlayerStats(initialPlayer, proficiencyWithoutLevel) };
        setPlayers((players) => [...players, newPlayer]);
    };

    let calculator;
    if (showType === "1 player") {
        calculator = (
            <div className="flex flex-row space-x-4 items-start">
                <div className="w-48 space-y-2"> {/* Fixed width of 12rem (48 in Tailwind) */}
                    <div className="border-2 border-gray-300 p-2 rounded-lg w-full">
                        <h3 className="font-bold text-center mb-2">Players</h3>
                        <div className="space-y-2">
                            {players.map((player, index) => (
                                <button
                                    key={index}
                                    className={`w-full py-1 px-2 rounded ${index === selectedPlayerIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setSelectedPlayerIndex(index)}
                                >
                                    {player.playerClass} {player.playerLevel}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={addPlayer}
                            className="mt-2 bg-green-500 text-white px-2 py-1 rounded w-full text-sm"
                        >
                            Add Player
                        </button>
                    </div>
                </div>

                <div className="w-3/10">
                    <div id="singlePlayer" className="border-2 border-gray-500 p-2 rounded-lg">
                        <PlayerCard
                            player={players[selectedPlayerIndex]}
                            onUpdate={(updatedPlayer) => updatePlayer(selectedPlayerIndex, updatedPlayer)}
                            onReset={() => resetPlayer(selectedPlayerIndex)}
                            onRemove={() => removePlayer(selectedPlayerIndex)}
                        />
                    </div>
                </div>

                <div className="w-2/10 space-y-4">
                    {enemies.map((enemy, index) => (
                        <div key={index} className="border-2 border-gray-500 p-2 rounded-lg">
                            <RatesCard
                                player={players[selectedPlayerIndex]}
                                enemy={enemy}
                            />
                        </div>
                    ))}
                </div>

                <div id="enemyList" className="w-3/10 space-y-4">
                    {enemies.map((enemy, index) => (
                        <EnemyCard
                            key={index}
                            enemy={enemy}
                            onRemove={() => handleRemoveEnemy(index)}
                            isEnabled={true}
                            levelDifference={levelDifferences[index] || 0}
                            onLevelDifferenceChange={(value) => handleLevelDifferenceChange(index, value)}
                            onEnemyUpdate={(updatedEnemy) => updateEnemy(index, updatedEnemy)}
                        />
                    ))}
                    <button onClick={addEnemy} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                        Add Enemy
                    </button>
                </div>
            </div>
        );
    } else if (showType === "simple calculator") {
        calculator = <h1> :3 </h1>;
    }

    return (
        <div className="p-6">
            <div className="flex bg-white shadow-md rounded-lg p-6 mb-6">
                <PWLCheckbox bool={proficiencyWithoutLevel} onChange={(checked) => setProficiencyWithoutLevel(checked)} />
                <PickAverageType value={averageType} onChange={(value) => setAverageType(value)} />
                <PickShowType value={showType} onChange={(value) => setShowType(value)} />
            </div>
            {calculator}
        </div>
    );
}
