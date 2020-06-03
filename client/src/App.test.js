import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {

  // The App component will render the Fib component which will then
  // will try to access the server that might be innaccessible at the moment
  // so avoid any crashes we need to comment the following lines.
  //
  // if we were running a real test suite right here rather than making a 
  // request off to the real express API what we'd probably do is setup a little
  // faker module to kind of mock out that request and return some dummy JSON.

  // const { getByText } = render(<App />);
  // const linkElement = getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
