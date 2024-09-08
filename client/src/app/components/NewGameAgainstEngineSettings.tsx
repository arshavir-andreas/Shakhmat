import { InputNumber } from 'primereact/inputnumber';
import { Slider } from 'primereact/slider';
import React, { FormEvent, useState } from 'react';
import { colorChoices } from '../utils';
import { RadioButton } from 'primereact/radiobutton';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { useAppSelector, useAppDispatch } from '../store';
import { RootState } from '../store';
import { setEngineELO, setTheUserColor, startTheGame } from '../store/againstEngineGameSlice';

export default function NewGameAgainstEngineSettings() {
    const [userColorChoice, setUserColorChoice] = useState('random');

    const engineELO = useAppSelector((state: RootState)=> state.againstEngineGameSlice.engineELO);

    const dispatch = useAppDispatch();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        let colorChoice = userColorChoice;

        if (userColorChoice === 'random') {
            colorChoice = Math.random() <= 0.5 ? 'white' : 'black';
        }

        dispatch(setTheUserColor(colorChoice as ('white' | 'black')));

        dispatch(startTheGame());
    }

    return (
        <form onSubmit={handleSubmit}>
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
                    onValueChange={(e) => dispatch(setEngineELO(Number(e.value)))}
                    max={3300}
                    min={1000}
                />

                <Slider
                    value={engineELO}
                    onChange={(e) => dispatch(setEngineELO(Number(e.value)))}
                    max={3300}
                    min={1000}
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
        </form>
    );
}
