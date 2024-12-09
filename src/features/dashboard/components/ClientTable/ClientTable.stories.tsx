import type { Meta, StoryObj } from "@storybook/react";

import { ClientTable } from ".";
import { testClient, testClients } from "@/test/testData";
import { expect, within } from "@storybook/test";

const meta: Meta<typeof ClientTable> = {
  component: ClientTable,
};

export default meta;

type Story = StoryObj<typeof ClientTable>;

export const Empty: Story = {
  args: {
    clients: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};

export const FullPage: Story = {
  args: {
    clients: testClients,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
