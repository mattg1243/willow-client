import React from "react";
import type { Preview } from "@storybook/react";
import { AppProvider } from "../src/app/provider";
import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <AppProvider>
          <Story />
        </AppProvider>
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
