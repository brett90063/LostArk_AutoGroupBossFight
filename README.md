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
2. Insert a Drawing:
   - Go to `Insert` > `Drawing`.
   - In the drawing tool, create a shape (e.g., a rectangle or a circle) that will act as your button.
   - Customize the shape as desired (add text, change color, etc.).
   - Click `Save and Close`.
3. Assign the Script to the Drawing:
   - Click on the drawing you just created to select it.
   - Click the three vertical dots in the top right corner of the drawing and select `Assign script`.
   - Enter the name of the function you want to execute when the button is clicked. For example, if your function is named `autoGroupBossFight`, you would enter `autoGroupBossFight`.
   - Click `OK`.
4. Click the button (drawing) in your Google Sheet to execute the script.
