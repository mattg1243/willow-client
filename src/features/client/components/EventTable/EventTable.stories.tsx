import type { Meta, StoryObj } from "@storybook/react";

import { testEvents, testUser } from "@/test/testData";
import { within } from "@storybook/test";
import { EventsTable } from ".";

const meta: Meta<typeof EventsTable> = {
  component: EventsTable,
};

export default meta;

type Story = StoryObj<typeof EventsTable>;

export const Empty: Story = {
  args: {
    clientId: testUser.id,
    events: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};

export const FullPage: Story = {
  args: {
    clientId: testUser.id,
    events: testEvents,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
