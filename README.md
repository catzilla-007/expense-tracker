# Expense Tracker

Track your expenses from the comfort of your phone online or offline and automagically list it to your own personal google sheet

This PWA is a simple app that helps you track your expenses and manage your expenditures. This app simply connects
to your google sheet. Then you can do whatever you want to your google sheet. A nice perk is that you can set your sheet to private. No need to allow public access to your google sheet.

## How to use Expense Tracker

This expense tracker can be installed in your phone. You just need to follow the steps described below.

### Install the app

Write instructions how to install the app

### Connect your Google Sheet

1. Open your spreadsheet and choose **Extensions → Apps Script**. Your script must
   implement `doGet(e)` and append `e.parameter.name`, `e.parameter.price`,
   `e.parameter.description`, and `e.parameter.date` to the intended sheet.
   The script source is not included in this repository.
2. Deploy the script as a **Web app**, with **Execute as: Me** and
   **Who has access: Anyone** so this app can call it without an interactive Google sign-in. See
   [Google's web app deployment guide](https://developers.google.com/apps-script/guides/web).
3. Copy the deployed URL in the form
   `https://script.google.com/macros/s/<deployment-id>/exec` (not a `/dev` URL or spreadsheet link).
4. Open the **Settings** gear in Expense Tracker, paste the URL, and select **Save**.
   Saving validates the URL format; verify actual delivery using a test spreadsheet.

The connection is stored in IndexedDB in this browser/device, alongside queued
expenses. Configure each device separately. Clearing browser site data removes both.
There is no default connection, including after upgrading from the hard-coded version.

You can record expenses before setup or while offline. They remain on the device
and sync after setup, on app startup, or when connectivity returns. Use **Sync now**
in Settings to retry manually. Existing queued expenses are preserved during upgrades
and go to the first connection you configure.

To replace or clear a connection, first sync all pending expenses. Changing it is
blocked while expenses remain queued or synchronization is in progress. Clearing a
connection leaves recording available; new expenses queue until setup is complete.

Uploads retain the existing GET parameter contract. HTTP failures retain expenses
for retry. Because the external script's response contract is unspecified, an HTTP
200 application error cannot reliably be detected, and ambiguous network failures
can cause duplicates on retry. Integration responses are not cached by the PWA.

### Troubleshoot CORS errors

A `No 'Access-Control-Allow-Origin' header` error can mean Apps Script returned a
sign-in, permissions, or script error page instead of its normal response. The app
already sends a simple GET request and follows redirects.

- Check **Deploy → Manage deployments**: the web app must run as **Me** and allow
  **Anyone**, including visitors who are not signed in. If your organization does
  not allow anonymous web apps, this direct browser integration needs a different
  deployment/account or an authenticated backend.
- Make sure `doGet(e)` returns a Content Service response after appending the row,
  for example `return ContentService.createTextOutput('OK');`. Content Service
  redirects to `script.googleusercontent.com`; the browser follows this automatically.
- After editing the script, update the deployment to a **New version** and check
  that Settings contains its `/exec` URL.
- Inspect **Executions** in Apps Script for failures. Use a test spreadsheet to
  verify delivery; opening the expense URL directly can append another row.

Do not switch the request to `mode: 'no-cors'`: its opaque response would prevent
the app from checking HTTP success before removing a locally saved expense.
Failed requests remain queued. Check the sheet before retrying because a blocked
response can occur after the script has already appended the row.

## For Developers

You want to experiment and try it for yourself? Feel free to do so!

### Prerequisites

Use Node.js 24 LTS and npm. With nvm installed:

```sh
nvm install
nvm use
npm ci
```

### Starting the App

```sh
npm run dev
```

### Building

To create a production version:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

### Validation

```sh
npm run check
npm run lint
npm run build
```

Run `npm run format` to apply Prettier formatting. The app uses Svelte 5,
SvelteKit 3, and the static adapter; build output is written to `build/`.
