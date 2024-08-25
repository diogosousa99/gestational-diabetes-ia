import { Button, Form } from 'react-bootstrap';
import { useModelPredictionViewModel } from './hooks';
import { FeatureEnum } from '../../store';
import style from './model-prediction.module.scss';

function valueToPercentage(value: number, decimals = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
}

const InputMinValue: { [key in FeatureEnum]: number } = {
    [FeatureEnum.AGE]: 18,
    [FeatureEnum.PREGNANCY_NO]: 0,
    [FeatureEnum.WEIGHT]: 40,
    [FeatureEnum.HEIGHT]: 100,
    [FeatureEnum.BMI]: 0,
    [FeatureEnum.HEREDITY]: 0,
};

export function ModelPredictionView() {
    const { currentModel, features, formData, predictionResult, _handleChange, _handleChangeHeredity, _handleSubmit } =
        useModelPredictionViewModel();

    const { prediction, metrics } = predictionResult ?? {};

    const { accuracy, precision, recall, f1 } = metrics ?? {};

    return (
        <div className={style.modelPredictionContainer}>
            <h2>{currentModel?.fullName} Model Prediction</h2>
            <Form className="w-50" onSubmit={_handleSubmit}>
                {features?.map((feature) => (
                    <Form.Group className="mb-3" key={feature.name}>
                        <Form.Label>{feature.description}</Form.Label>
                        {feature.name === FeatureEnum.HEREDITY ? (
                            <Form.Select
                                required
                                name={feature.name}
                                value={formData[feature.name] ?? ''}
                                onChange={_handleChangeHeredity}
                            >
                                <option value={0}>No</option>
                                <option value={1}>Yes</option>
                            </Form.Select>
                        ) : (
                            <Form.Control
                                required
                                type="number"
                                step=".01"
                                min={InputMinValue[feature.name]}
                                name={feature.name}
                                placeholder={feature.uiName}
                                value={formData[feature.name] ?? ''}
                                onChange={_handleChange}
                            />
                        )}
                    </Form.Group>
                ))}
                <Button className="mb-3" variant="primary" type="submit">
                    Predict
                </Button>
            </Form>
            {predictionResult !== undefined ? (
                <div>
                    Based on the provided data, the prediction is:{' '}
                    <strong>{valueToPercentage(prediction as number)}</strong>
                    <h3>Metrics:</h3>
                    <div>
                        <strong>Accuracy:</strong> {valueToPercentage(accuracy as number)}
                    </div>
                    <div>
                        <strong>Precision:</strong> {valueToPercentage(precision as number)}
                    </div>
                    <div>
                        <strong>Recall:</strong> {valueToPercentage(recall as number)}
                    </div>
                    <div>
                        <strong>F1:</strong> {valueToPercentage(f1 as number)}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
