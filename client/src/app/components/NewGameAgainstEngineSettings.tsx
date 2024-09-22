import { InputNumber } from 'primereact/inputnumber';
import { Slider } from 'primereact/slider';
import React, { FormEvent, useMemo, useState } from 'react';
import { colorChoices } from '../utils';
import { RadioButton } from 'primereact/radiobutton';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

type NewGameAgainstEngineSettingsProps = {
    engines: Engine[];
};

export default function NewGameAgainstEngineSettings({
    engines,
}: NewGameAgainstEngineSettingsProps) {
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

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        // let colorChoice = userColorChoice;

        // if (userColorChoice === 'random') {
        //     colorChoice = Math.random() <= 0.5 ? 'white' : 'black';
        // }

        // dispatch(setTheUserColor(colorChoice as 'white' | 'black'));

        // dispatch(startTheGame());
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className=" mb-[10px]">
                <Dropdown 
                    value={engine} 
                    onChange={(e) => handleEngineChange((e.value as Engine))}
                    options={engines}
                    optionLabel="name" 
                    placeholder={`Select a chess engine`}
                    filter
                    className="w-full md:w-14rem"
                />
            </div>

            {
                engine !== undefined ? (
                    <>
                        <div>
                            <label
                                htmlFor="engine-elo"
                                className="mr-[20px]"
                            >
                                Engine ELO
                            </label>

                            <InputNumber
                                inputId="engine-elo"
                                value={engineELO}
                                onValueChange={(e) =>
                                    setEngineELO(Number(e.value))
                                }
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

                        <div className=" flex gap-[10px] mt-[30px]">
                            {colorChoices.map((colorChoice) => {
                                return (
                                    <div
                                        className="flex items-center mr-[20px]"
                                        key={colorChoice.value}
                                    >
                                        <RadioButton
                                            inputId={colorChoice.value}
                                            name={colorChoice.value}
                                            value={colorChoice.value}
                                            onChange={(e) => setUserColorChoice(e.value)}
                                            checked={userColorChoice === colorChoice.value}
                                        />
            
                                        <label
                                            htmlFor={colorChoice.value}
                                            className="ml-[10px]"
                                        >
                                            <figure className=" grid justify-center items-center">
                                                <Image
                                                    src={colorChoice.imgPath}
                                                    alt={colorChoice.title}
                                                    width={50}
                                                    height={50}
                                                />
            
                                                <figcaption>{colorChoice.title}</figcaption>
                                            </figure>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
            
                        <Button
                            label={`Start the game`}
                            type="submit"
                            className=" mt-[20px]"
                        />
                    </>
                ) : (
                    <></>
                )
            }
        </form>
    );
}
