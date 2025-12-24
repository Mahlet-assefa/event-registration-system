import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';
import Dashboard from './Dashboard';
import { AuthProvider } from '../context/authContext';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders = ({ children }) => (
    <BrowserRouter>
        <AuthProvider>
            {children}
        </AuthProvider>
    </BrowserRouter>
);

describe('Login Component', () => {
    it('renders login form correctly', () => {
        render(<Login />, { wrapper: AllTheProviders });
        expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    });

    it('shows error message for empty fields (CR-002)', async () => {
        render(<Login />, { wrapper: AllTheProviders });

        // Trigger empty submit
        const form = screen.getByRole('button', { name: /Login/i }).closest('form');
        fireEvent.submit(form);

        // Use a simpler check that is more likely to be stable in this environment
        await waitFor(() => {
            const errorElement = screen.queryByText(/Please enter both username and password/i);
            expect(errorElement).not.toBeNull();
        }, { timeout: 2000 });
    });
});

describe('Dashboard Component', () => {
    it('renders dashboard heading', () => {
        render(<Dashboard />, { wrapper: AllTheProviders });
        expect(screen.getByText(/Available Events/i)).toBeInTheDocument();
    });
});
