type ColorChoice = {
    imgPath: string;
    value: string;
    title: string;
};

type PositionToEvaluate = {
    engineId: string;
    engineELO: number;
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

type EngineDetails = {
    id: string;
    name: string;
    ELO: number;
    isWhite: boolean;
};

type GameAgainstEngine = {
    engine: EngineDetails;
    PGN: string;
};
