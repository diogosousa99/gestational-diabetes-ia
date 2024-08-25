import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMetadata } from './hooks/use-get-metadata.hook';

export function CheckPath() {
    const navigate = useNavigate();

    const statePath = window.location.pathname;

    const { metadata } = useGetMetadata();

    const { models } = metadata || {};

    useEffect(() => {
        if (statePath === '/' && models?.length) {
            navigate(`/${models[0].shortName}`);
        }
    }, [navigate, statePath, models]);

    return <></>;
}
