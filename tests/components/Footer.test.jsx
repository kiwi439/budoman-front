import React from 'react';
import Footer from '../../src/components/footer/Footer.jsx';
import renderWithProviders from '../components/helpers/render_with_providers.jsx';

test('render Footer component with success', () => {
  renderWithProviders(<Footer />);
});
