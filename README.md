# LostArk Auto Group Boss Fight

## Description

This project is a Google Apps Script designed to automatically group players for boss fights in the game Lost Ark. The script reads player data from a Google Sheets document, filters candidates based on their roles and willingness to participate, and creates balanced teams for specific boss fights.

## Features

- Automatically groups players into balanced teams for boss fights.
- Filters candidates based on their roles and willingness to participate.
- Calculates and includes the average gear score for damage roles in each group.
- Outputs grouped results to new sheets named after each boss.

## Requirements

- Google Account
- Google Sheets API enabled

## Usage

1. Make sure your file is a Google Sheet instead of an Excel file.

![google_sheet](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/c21a7b40-a383-4ff1-b3f9-f1426fdac9f6)

2. Insert javascript:
   - Go to `Extension` > `Apps Script`

   ![apps_script](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/11e00504-d5c9-4601-b703-fff21cf6dd8a)

   - Paste the JavaScript code from this project.

   ![paste_code](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/7690e416-0c8d-4bdb-936b-d75b792fc85c)

   - Replace the file ID in the JavaScript code:

   ![replace_file_ID](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/d9129d9e-e597-4dc8-b7bf-a365fe8d8adf)

   - The file ID is in the URL between `/d` and `/edit`.

   ![file_ID_in_URL](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/d22c311b-b73f-4918-b878-34c07f0b2978)

   - Replace the sheet name in the JavaScript code:

   ![replace_sheet_name](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/32fd6011-a0ee-4f23-8586-ef8be684c6fd)

   - Specify the sheet that you want to generate groups by data or pivot table.

   ![sheet_name_location](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/2cdce145-5710-41b1-b94e-0ae309aed7aa)

4. Insert a Drawing:
   - Go to `Insert` > `Drawing`.

   ![insert_drawn](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/19a4ad7e-de77-4a00-9066-b56bc85941f5)

   - In the drawing tool, create a shape (e.g., a rectangle or a circle) that will act as your button.
   - Customize the shape as desired (add text, change color, etc.).
   - Click `Save and Close`.

   ![darwn_save](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/237314ee-7afd-4179-8418-cd4ea2aeb8b5)

3. Assign the Script to the Drawing:
   - Click on the drawing you just created to select it.
   - Click the three vertical dots in the top right corner of the drawing and select `Assign script`.

   ![three_vertical_dots](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/f5f0dd1f-666a-44c4-b8b6-cb5a21f4d8b1)

   - Enter the name of the function you want to execute when the button is clicked. For example, if your function is named `autoGroupBossFight`, you would enter `autoGroupBossFight`.

   ![function_name](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/424a6532-db2f-4453-be1b-83260a1b5867)

   - Click `OK`.
4. Click the button (drawing) in your Google Sheet to execute the script.

   ![click_drawn_execute_function](https://github.com/brett90063/LostArk_AutoGroupBossFight/assets/11819638/1d00c540-97cd-4b2f-a4b3-ed2f40ea1b9c)
