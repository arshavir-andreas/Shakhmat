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

type FinishedGameStatus = {
    winner: 'white' | 'black' | undefined;
};

type ErrorDetails = {
    statusCode: number;
    message: string;
};

type UserCredentials = {
    id: string;
    username: string;
};

type Engine = {
    id: string;
    name: string;
    minELO: number;
    maxELO: number;
};
