import { InputNumber } from 'primereact/inputnumber';
import { Slider } from 'primereact/slider';
import React, { FormEvent, useMemo, useState } from 'react';
import { colorChoices } from '../utils';
import { RadioButton } from 'primereact/radiobutton';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/navigation';
import { fetcherIncludingCredentials } from '../utils/axios-fetchers';

type NewGameAgainstEngineSettingsProps = {
    engines: Engine[];
};

export default function NewGameAgainstEngineSettings({
    engines,
}: NewGameAgainstEngineSettingsProps) {
    const router = useRouter();

    const [engine, setEngine] = useState<Engine | undefined>(undefined);

    const [engineELO, setEngineELO] = useState(0);

    const [userColorChoice, setUserColorChoice] = useState('random');

    const minELO = useMemo(() => {
        if (engine === undefined) {
            return 0;
        }

        return engine.minELO;
    }, [engine]);

    const maxELO = useMemo(() => {
        if (engine === undefined) {
            return 0;
        }

        return engine.maxELO;
    }, [engine]);

    function handleEngineChange(newEngine: Engine) {
        setEngine(newEngine);

        setEngineELO(newEngine.minELO);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        let isTheEngineWhite = false;

        if (userColorChoice === 'random') {
            isTheEngineWhite = Math.random() <= 0.5;
        } else if (userColorChoice === 'black') {
            isTheEngineWhite = true;
        }

        try {
            const { data } = (await fetcherIncludingCredentials.post(
                `/engines/new-game`,
                {
                    engineId: engine!.id,
                    isTheEngineWhite,
                    engineELO,
                },
            )) as { data: string };

            router.push(`/games/${data}`);
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className=" mb-[10px]">
                <Dropdown
                    value={engine}
                    onChange={(e) => handleEngineChange(e.value as Engine)}
                    options={engines}
                    optionLabel="name"
                    placeholder={`Select a chess engine`}
                    filter
                    className="w-full md:w-14rem"
                />
            </div>

            {engine !== undefined ? (
                <>
                    <div>
                        <label
                            htmlFor="engine-elo"
                            className="mr-[20px] font-bold"
                        >
                            Engine ELO:
                        </label>

                        <InputNumber
                            inputId="engine-elo"
                            value={engineELO}
                            onValueChange={(e) => setEngineELO(Number(e.value))}
                            max={maxELO}
                            min={minELO}
                            className=" mb-[10px]"
                        />

                        <Slider
                            value={engineELO}
                            onChange={(e) => setEngineELO(Number(e.value))}
                            max={maxELO}
                            min={minELO}
                            step={100}
                        />
                    </div>

                    <div className=" mt-[30px]">
                        <p className=" font-bold text-[18px]">Play as: </p>

                        <div className=" flex gap-[5px] sm:gap-[10px]">
                            {colorChoices.map((colorChoice) => {
                                return (
                                    <div
                                        className="flex items-center mr-[10px] sm:mr-[20px]"
                                        key={colorChoice.value}
                                    >
                                        <RadioButton
                                            inputId={colorChoice.value}
                                            name={colorChoice.value}
                                            value={colorChoice.value}
                                            onChange={(e) =>
                                                setUserColorChoice(e.value)
                                            }
                                            checked={
                                                userColorChoice ===
                                                colorChoice.value
                                            }
                                        />

                                        <label
                                            htmlFor={colorChoice.value}
                                            className="ml-[5px] sm:ml-[10px]"
                                        >
                                            <figure className=" grid justify-center items-center">
                                                <Image
                                                    src={colorChoice.imgPath}
                                                    alt={colorChoice.title}
                                                    width={50}
                                                    height={50}
                                                />

                                                <figcaption>
                                                    {colorChoice.title}
                                                </figcaption>
                                            </figure>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Button
                        label={`Start the game`}
                        type="submit"
                        className=" mt-[20px]"
                    />
                </>
            ) : (
                <></>
            )}
        </form>
    );
}
