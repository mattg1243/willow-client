import type { Meta, StoryObj } from "@storybook/react";

import { Header } from "./index";
import { testUser } from "@/test/testData";
import { expect, within } from "@storybook/test";

const meta: Meta<typeof Header> = {
  component: Header,
};

export default meta;

type Story = StoryObj<typeof Header>;

export const NoUser: Story = {
  args: {
    user: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = await canvas.findByTestId("login-link");
    expect(link).toBeInTheDocument();
  },
};

export const WithUser: Story = {
  args: {
    user: testUser,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = await canvas.findByTestId("account-btn");
    expect(btn).toBeInTheDocument();
  },
};
