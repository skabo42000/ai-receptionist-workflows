# Calendar and alert reference workflows

The JSON exports are **inactive templates**. Live credentials, account IDs, execution data and tenant URLs were removed. Authentication settings remain enabled; bind your own credentials before testing.

## Calendar templates

1. Import `voice-agent-check-availability.json` and `voice-agent-book-appointment.json` into your own n8n instance.
2. Bind Webhooks to Header Auth: `X-Agent-Auth` with a random secret. Bind Calendly HTTP nodes to a separate Header Auth credential: `Authorization: Bearer <your token>`.
3. Replace `REPLACE_WITH_EVENT_TYPE_ID` with your own test event type. Review event duration, time zone and required question names.
4. Replace `YOUR_N8N_HOST` and the secret placeholder in `voice-agent-tools.example.json` within your **private** platform configuration. Never commit the populated file.
5. Test availability using a synthetic caller. The booking template performs an actual Calendly write when activated and invoked. Attach it only after testing and requiring explicit confirmation.
6. Keep workflows inactive until your tests pass. Review provider permissions, supported endpoints, account plan and quotas in your account.

Availability accepts plain JSON or a Vapi tool-call envelope:

```json
{"caller_timezone":"America/Chicago","preferred_date":"2026-10-12"}
```

Booking requires `name`, `email`, `phone_number`, `company_website` and `start_time`; `timezone` and `call_id` are supported. Phone numbers must match the validator's expected format. Use synthetic contact details for tests.

The response is plain JSON for direct requests, or `{ "results": [{ "toolCallId": "...", "result": "JSON string" }] }` for a Vapi envelope. Inspect status before saying a booking succeeded. A timeout can be ambiguous: reconcile with the calendar before retrying; the write template does not provide a durable exactly-once guarantee.

## Chat and notifications

`anna-chat-system-prompt.md` is a prompt reference. Create your own authenticated Webhook -> model / fallback -> response flow and follow the root README's contract. Hard cost caps belong at the provider and in shared workflow state.

`lead-alerts-build-alert.js` belongs in an n8n Code node after an authenticated webhook. It prepares content and applies best-effort deduplication / daily caps. An email-delivery node is not included. Enable call-report forwarding separately in Vapi after deciding what personal data to collect and retain.

Execution logging is disabled in the public calendar exports to reduce persisted personal data. Choose your retention and error-monitoring policy before deployment.
