# Valorant Tournament Website

This is a website to view an ongoing Valorant tournament as well as edit details. There are two endpoints, `/` and `/edit`, where the first one is for viewing the ongoing tournament and the latter is for editing the state of the current tournament.

## How it works

When a user views the tournament, a `GET` request is filed to an API endpoint to fetch a single json file. When an admin wants to edit the current tournament, a `POST` request is filed to an API endpoint to update said json file. It is very simple in nature.
