import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetMetadata } from '../../../hooks';
import { FeatureEnum, ModelPrediction, predict, PredictionResult } from '../../../store';

export function useModelPredictionViewModel() {
    const { model } = useParams();

    const { indexedModels, metadata } = useGetMetadata();

    const currentModel = indexedModels?.[model!];

    const { features } = metadata || {};

    const [formData, _setFormData] = useState<ModelPrediction>(() => {
        const initialFormData: Record<string, string | number> = {};

        features?.forEach((feature) => {
            initialFormData[feature.name] = '';
            initialFormData[FeatureEnum.HEREDITY] = 0;
        });

        return initialFormData as ModelPrediction;
    });

    const [predictionResult, _setPredictionResult] = useState<PredictionResult | undefined>(undefined);

    const _handleCleanFormData = useCallback(() => {
        _setFormData((prev) => {
            const newFormData = { ...prev };

            features?.forEach((feature) => {
                newFormData[feature.name] = '';
                newFormData[FeatureEnum.HEREDITY] = 0;
            });

            return newFormData;
        });
        _setPredictionResult(undefined);
    }, [features]);

    const _handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        _setFormData((prev) => ({
            ...prev,
            [name]: +value,
        }));
    }, []);

    const _handleChangeHeredity = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        _setFormData((prev) => ({
            ...prev,
            [name]: +value,
        }));
    }, []);

    const _handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const result = await predict(model!, formData);

            _setPredictionResult(result);
        },
        [formData, model]
    );

    useEffect(() => {
        _handleCleanFormData();
    }, [model, _handleCleanFormData]);

    return {
        currentModel,
        features,
        formData,
        predictionResult,
        _handleChange,
        _handleChangeHeredity,
        _handleSubmit,
    };
}
