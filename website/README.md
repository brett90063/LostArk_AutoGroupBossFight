# Event Calendar with Google Sheets Integration

The subproject(`/website`) is a simple web-based event calendar that integrates with Google Sheets to display event data. The calendar highlights specific event dates, and clicking on these dates will fetch and display event data from the specified Google Sheets.

## Features

- Dynamic calendar generation for the year 2024.
- Highlighted event dates with customizable event names.
- Integration with Google Sheets to fetch and display event data.
- Display of additional event data upon clicking an event date.
- Responsive design using Bootstrap for a clean and modern interface.

## Files

- `Index.html`: The main HTML file containing the structure and script for the calendar.
- `Code.gs`: The Google Apps Script file to fetch data from Google Sheets.

## Installation

### Prerequisites

- A Google account.
- Access to Google Apps Script and Google Sheets.

### Setup

1. **Create a new Google Sheet:**

   - Create a new Google Sheet and populate it with your event data. Make sure to name your sheets according to the event names (e.g., `日月鹿`, `普牛`, `普魅`).

2. **Create a Google Apps Script project:**

   - Open the Google Sheet you created.
   - Go to `Extensions` > `Apps Script`.
   - Delete any code in the script editor and replace it with the code provided in the `Code.gs` file.

3. **Deploy the script as a web app:**

   - Click on `Deploy` > `New deployment`.
   - Select `Web app` and provide the necessary information.
   - Click `Deploy` and authorize the script.
   - Copy the URL of the deployed web app.

4. **Edit the `Index.html` file:**

   - Update the Google Sheets file ID in the `getSheetData` function of `Code.gs` to match your Google Sheet ID.

5. **Host the `Index.html` file:**

   - You can host the `Index.html` file on any web server or use GitHub Pages to serve the file.

## Usage

1. **Access the Web App:**

   - Open the URL of your deployed web app in a browser.

2. **Interact with the Calendar:**

   - The calendar will display the current month by default.
   - Click on the month buttons to navigate between different months.
   - Click on highlighted event dates to fetch and display event data from the Google Sheet.

## Adding Events

To add events, you need to modify the `Index.html` file. Specifically, you need to update the script section to include your event dates and names.

1. **Open `Index.html`:**

   - Locate the `events` object in the `<script>` section.

2. **Add your events:**

   - Add your event dates and names in the `events` object. For example:
     ```javascript
     const events = {
       "2024-07-04": "日月鹿",
       "2024-07-05": "普牛",
       "2024-07-07": "普魅"
     };
     ```

3. **Save and deploy:**

   - Save your changes to the `Index.html` file and deploy it to your web server.

## Notes

1. **Replace File ID:**
   - Ensure you replace the Google Sheets file ID in the `Code.gs` script with your actual Google Sheets file ID.

2. **Event Configuration:**
   - When adding events, modify the `events` object in the `<script>` section of the `Index.html` file.

By following these steps, you will be able to set up and use the event calendar with your Google Sheets data seamlessly.

