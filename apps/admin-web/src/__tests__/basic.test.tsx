import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';

// A simple component for testing
const SimpleComponent = () => <div>Hola Mundo</div>;

describe('Admin Web - Initial Test', () => {
  it('should render correctly', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Hola Mundo')).toBeInTheDocument();
  });
});
