import type { LoaderFunctionArgs } from "react-router";
import { json } from "react-router";
import { healthCheck } from "../lib/openstatus";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const health = await healthCheck();
    return json(health, { status: 200 });
  } catch (error) {
    console.error("Health check failed:", error);
    return json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 }
    );
  }
}