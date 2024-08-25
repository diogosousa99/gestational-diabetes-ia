import { useCallback } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useGetMetadata } from '../../hooks/use-get-metadata.hook';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Models } from '../../store/types';

export function Header() {
    const navigate = useNavigate();

    const { model: modelParam } = useParams();

    const { indexedModels, metadata } = useGetMetadata();

    const { models } = metadata || {};

    const _selectOption = useCallback((model: Models) => navigate(`/${model.shortName}`), [navigate]);

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand>Gestational Diabetes</Navbar.Brand>
                    <Navbar.Collapse id="navbarScrollingDropdown">
                        <Nav>
                            <NavDropdown
                                id="header-dropdown"
                                title={(indexedModels?.[modelParam!]?.fullName as string) || 'Select Model'}
                            >
                                {models?.map((model) => (
                                    <NavDropdown.Item
                                        active={modelParam === indexedModels?.[model.shortName]?.shortName}
                                        key={model.shortName}
                                        onClick={() => _selectOption(model)}
                                    >
                                        {model.fullName}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <main>
                <Outlet />
            </main>
        </>
    );
}
