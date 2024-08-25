import { Metadata, ModelPrediction, PredictionResult } from './types';

const BASE_URL = 'http://127.0.0.1:8000';

export async function getMetadata(): Promise<Metadata | undefined> {
    try {
        const response = await fetch(`${BASE_URL}/metadata`);

        if (!response.ok) throw new Error('Failed to fetch metadata with status: ' + response.status);

        const json = await response.json();

        return json;
    } catch (error) {
        console.error(error);
    }
}

export async function predict(model: string, data: ModelPrediction): Promise<PredictionResult | undefined> {
    try {
        const response = await fetch(`${BASE_URL}/predict/${model}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to fetch prediction with status: ' + response.status);

        const json = await response.json();

        return json;
    } catch (error) {
        console.error(error);
    }
}
