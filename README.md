# orca-session-id

An [OpenCode 2](https://opencode.ai) plugin that adds the `X-OrcaRouter-Session-Id` header to every request sent through the `orcarouter` provider.

The header value is the OpenCode session ID, so it is stable for the whole conversation and different for each new one. This gives OrcaRouter an explicit conversation identifier instead of having to infer it.

## How it works

The plugin registers a `model.request` session hook scoped to `providerID: "orcarouter"`:

- It runs before HTTP diagnostics, so the header is visible to later hooks such as `http.request`.
- It removes any existing `x-orcarouter-session-id` header (any casing) and sets a single lowercase one, so the header is never duplicated.
- It applies to primary, compaction, title and generate requests of the same session.
- It makes no network calls, does not log, and does not touch request bodies.

Requests to other providers are not modified.

## Requirements

- OpenCode `2.x`
- A provider configured with the ID `orcarouter`

## Install

Add the plugin to your OpenCode config (`~/.config/opencode/opencode.jsonc` or a project `opencode.jsonc`):

```jsonc
{
  "plugins": [
    "orca-session-id@git+https://github.com/Tailmon/orca-session-id.git"
  ]
}
```

Restart OpenCode. No further configuration is needed.

### Local development

Clone the repo and point the config to the local path, or copy `index.ts` into your plugins directory.

```sh
git clone https://github.com/Tailmon/orca-session-id.git
cd orca-session-id
npm install
npm run typecheck
```

## Verify

Add a temporary `http.request` hook (or inspect your OrcaRouter request logs) and confirm that requests to `orcarouter` carry `x-orcarouter-session-id` with a value matching the current session ID, and that it changes when you start a new session.

## Notes

- If another plugin or a static `headers` entry in your config sets the same header, remove it. This plugin overwrites it, and two writers with different values make the result depend on hook order.
- The plugin only supplies the identifier. It cannot fix server-side behavior such as prompt prefix caching on the router.
- The provider ID is matched exactly. If you named your provider differently, change `providerID` in `index.ts`.

## License

MIT
