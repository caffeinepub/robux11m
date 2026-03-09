# Robux11M

## Current State
A Roblox-style landing page with:
- Screen 1: Username input + Continue button (dark card, gaming grid background)
- Screen 2: Loading/verification spinner (3 second auto-transition)
- Screen 3: Confirmation screen with "Claim Your Robux" button
- Header: "robux1m - Partners program" branding

## Requested Changes (Diff)

### Add
- Screen 2.5: Robux amount selection screen (shown after username verification loading)
  - 5 green buttons: 1500, 4000, 8000, 10000, 15000 Robux (each with Robux coin icon)
- Screen 3 (new): Verify screen after amount selection
  - Roblox logo at top
  - Text: "Please click on the button below and complete 1 task to verify that you're not a robot!"
  - Word "verify" highlighted (styled differently -- glowing green or bold accent)
  - Big green "Verify" button
  - Clicking "Verify" redirects user to: https://surl.li/zzowfn

### Modify
- Screen flow now: landing → loading → amount selection → verify screen → redirect
- Old confirmation screen replaced by verify screen
- Screen type updated to include "amount-selection" and "verify" states

### Remove
- Old confirmation screen ("Account Verified!" + "Claim Your Robux" button)
- Old 3-screen flow

## Implementation Plan
1. Update Screen type to: "landing" | "loading" | "amount-selection" | "verify"
2. Add AmountSelectionScreen component with 5 Robux amount buttons (1500, 4000, 8000, 10000, 15000)
3. Add VerifyScreen component with highlighted "verify" text and Verify button that redirects to https://surl.li/zzowfn
4. Update App root to wire new screen flow
5. Remove old ConfirmationScreen
6. Keep all existing styling (gaming grid, dark card, green buttons, header)
