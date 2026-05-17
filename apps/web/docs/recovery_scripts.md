# Lex8 + Anchor8: Recovery Scripts

If a module crashes during the demo, use the following hot-swap protocols (accessible via `Ctrl+Shift+F`).

## Scenario 1: Drafter LLM Timeout
- **Trigger:** Anthropic API or DeepSeek API fails to respond within 8 seconds.
- **Action:** Hit `Ctrl+Shift+F` and select "Drafter Fallback".
- **Result:** The UI overlays the Fixture Screen ("Degraded Service Warning") and loads a pre-written static brief from `localStorage`. Continue narrating: *"As you can see, even when the upstream model fails, Lex8 gracefully degrades to the last autosaved state, preserving all attorney work product."*

## Scenario 2: Vault Vision OCR Failure
- **Trigger:** Tesseract or Playwright fails to launch during the redaction intercept.
- **Action:** Hit `Ctrl+Shift+F` and select "Vault Vision Bypass".
- **Result:** The UI immediately jumps to the "Redaction Failed - Unanimous Block" screen. Continue narrating: *"The pipeline has asynchronously caught the redaction leak, immediately halting the filing."*

## Scenario 3: War Room Deadlock
- **Trigger:** The CrewAI orchestrator (or mock API) fails to return a final ruling.
- **Action:** Hit `Ctrl+Shift+F` and select "Tribunal Tiebreaker".
- **Result:** The UI immediately renders the Lane 4 Review Queue, prompting the human partner to step in. Continue narrating: *"The agents couldn't reach a definitive consensus, so Anchor8 automatically escalates it to the Lane 4 human-in-the-loop queue."*
