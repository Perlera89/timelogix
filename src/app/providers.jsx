"use client";

import { ConfigProvider, theme } from "antd";

export default function Providers({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#9E2B25",
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
