import React from 'react';
import Footer from '../../src/components/footer/Index.jsx';
import renderWithProviders from '../components/helpers/render_with_state.jsx';

test('render Footer component with success', () => {
  renderWithProviders(<Footer />);
});