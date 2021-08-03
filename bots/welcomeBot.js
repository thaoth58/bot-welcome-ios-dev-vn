// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Import required Bot Framework classes.
const { ActionTypes, ActivityHandler, CardFactory } = require('botbuilder');

// Welcomed User property name
const WELCOMED_USER = 'welcomedUserProperty';

class WelcomeBot extends ActivityHandler {
    /**
     *
     * @param {UserState} User state to persist boolean flag to indicate
     *                    if the bot had already welcomed the user
     */
    constructor(userState) {
        super();
        // Creates a new user property accessor.
        // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors.
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);

        this.userState = userState;

        // Sends welcome messages to conversation members when they join the conversation.
        // Messages are only sent to conversation members who aren't the bot.
        this.onMembersAdded(async (context, next) => {
            // Iterate over all new members added to the conversation
            for (const idx in context.activity.membersAdded) {
                // Greet anyone that was not the target (recipient) of this message.
                // Since the bot is the recipient for events from the channel,
                // context.activity.membersAdded === context.activity.recipient.Id indicates the
                // bot was added to the conversation, and the opposite indicates this is a user.
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                    await context.sendActivity(`Welcome ${context.activity.membersAdded[idx].name} to iOS Developers VN.`);
                }
            }
            await context.sendActivity(`Vui lòng đọc nội quy: https://github.com/thaoth58/bot-welcome-ios-dev-vn/blob/main/rules.txt`);
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    async run(context) {
        await super.run(context);

        // Save state changes
        await this.userState.saveChanges(context);
    }

    async sendIntroCard(context) {
        const card = CardFactory.heroCard(
            'Welcome to Bot Framework!',
            'This is developed only for iOS Devs VN group',
            [''],
            [
                {
                    type: ActionTypes.OpenUrl,
                    title: 'Contact me',
                    value: 'https://www.facebook.com/truong.huu.thao/'
                }
            ]
        );

        await context.sendActivity({ attachments: [card] });
    }
}

module.exports.WelcomeBot = WelcomeBot;
