export enum ModelEnum {
    RFC = 'rfc',
    ETC = 'etc',
    GBC = 'gbc',
    ABC = 'abc',
    SVC = 'svc',
    LGR = 'lgr',
    XGB = 'xgb',
    LGB = 'lgb',
}

export enum FeatureEnum {
    AGE = 'age',
    PREGNANCY_NO = 'pregnancyNo',
    WEIGHT = 'weight',
    HEIGHT = 'height',
    BMI = 'bmi',
    HEREDITY = 'heredity',
}

export type Models = {
    shortName: ModelEnum;
    fullName: string;
};

export type Features = {
    name: FeatureEnum;
    uiName: string;
    description: string;
};

export type Metadata = {
    models: Models[];
    features: Features[];
};

export type ModelPrediction = {
    [key in FeatureEnum]: string | number;
};

export type PredictionMetrics = {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
};

export type PredictionResult = {
    prediction: number;
    metrics: PredictionMetrics;
};
