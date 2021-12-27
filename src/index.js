import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';

import { ThirdwebWeb3Provider } from '@3rdweb/hooks';
import { ChakraProvider } from '@chakra-ui/react';

// Define supported chains
const supportedChains = [4];

/**
 * Define supported wallets
 * injected - MetaMask, browser-based extension wallets
 * walletconnect - Wallet Connect
 * walletlink - Coinbase Wallet
 */
const connectors = {
  injected: {},
};

// Render the App component to the DOM
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChains}
    >
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
