"use client";

import dynamic from "next/dynamic";
import { type ComponentProps } from "react";
// We need to import the component type to infer props, but we can't import the value directly for usage if checking types.
// Actually, we can just import the component to get its types, standard import is fine for types.
import { DashboardClient } from "./DashboardClient";

// Dynamically import DashboardClient with SSR disabled
const DashboardClientDynamic = dynamic(
    () => import("./DashboardClient").then((mod) => mod.DashboardClient),
    { ssr: false }
);

type DashboardClientProps = ComponentProps<typeof DashboardClient>;

export function DashboardLoader(props: DashboardClientProps) {
    return <DashboardClientDynamic {...props} />;
}
