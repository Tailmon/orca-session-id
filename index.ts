/**
 * OpenCode 2: provide OrcaRouter's explicit conversation identifier.
 * Registers the model.request hook, which runs before HTTP diagnostics.
 * No network calls, no logging, no body edits, no changes to Cloak settings.
 * This implements the documented session integration; it cannot fix a
 * server-side failure to preserve the transformed prompt prefix.
 * Remove any other plugin that assigns this same header differently.
 */
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "orca-session-id",
  async setup(ctx) {
    await ctx.session.hook(
      "model.request",
      (event) => {
        // Normalize casing so an older, differently-cased header is not duplicated.
        for (const name of Object.keys(event.headers)) {
          if (name.toLowerCase() === "x-orcarouter-session-id") {
            delete event.headers[name]
          }
        }
        // Stable within this actual conversation; different for a new one.
        event.headers["x-orcarouter-session-id"] = event.sessionID
      },
      { providerID: "orcarouter" },
    )
  },
})
