import { useEffect, useMemo, useState } from 'react';
import { getMetadata } from '../store';
import { Metadata, Models } from '../store/types';

export function useGetMetadata() {
    const [metadata, setMetadata] = useState<Metadata | undefined>(undefined);

    const indexedModels = useMemo(() => {
        return metadata?.models.reduce((acc, model) => {
            acc[model.shortName] = model;
            return acc;
        }, {} as Record<string, Models>);
    }, [metadata]);

    useEffect(() => {
        getMetadata().then((metadata) => setMetadata(metadata));
    }, []);

    return { metadata, indexedModels };
}
