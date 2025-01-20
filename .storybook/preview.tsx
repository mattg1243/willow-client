import React from "react";
import type { Preview } from "@storybook/react";
import { AppProvider } from "../src/app/provider";
import { BrowserRouter as Router } from "react-router-dom";
import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <Router>
          <AppProvider>
            <Story />
          </AppProvider>
        </Router>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
