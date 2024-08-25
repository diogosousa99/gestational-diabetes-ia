import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModelPredictionView } from './views';
import { Header } from './components';
import { CheckPath } from './check-empty-path';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <CheckPath />
            <Routes>
                <Route path="/" element={<Header />}>
                    <Route path=":model" element={<ModelPredictionView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
