type ColorChoice = {
    imgPath: string;
    value: string;
    title: string;
};

type PositionToEvaluate = {
    engineELO?: number;
    fenPosition: string;
};

type EngineResponse = {
    from: string;
    to: string;
    promotion?: string;
};
