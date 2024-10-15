# Crowd-sourced Fitness Challenge App

This app enables users to create and participate in community-driven fitness challenges. Users can engage in challenges, chat with others, earn badges, and track progress all within a cross-platform mobile app.

## Features

### Key Objectives:
- **User Accounts**: Secure login and registration for users.
- **Challenge Creation**: Users can create fitness challenges, set goals, select images, and add badges.
- **Challenge Participation**: Users can search for challenges, chat with others, upload media, and complete goals.
- **Badges and Wall of Fame**: Earn badges and be featured on the Wall of Fame for completing challenges.

## Technologies

- **Frontend**: React Native with Expo, TypeScript, Redux
- **Backend**: Google Cloud Functions
- **Database**: Firebase Firestore (NoSQL) and Firebase Data Connect (PostgreSQL via Cloud SQL)
- **Authentication**: Firebase Authentication
- **Real-time Chat**: Firebase Firestore
- **Testing**: Jest
- **Project Management**: Trello, GitHub
- **Communication**: Discord

## Project Setup

### Steps to Set Up Locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/paolacernada/Crowd-sourced-Fitness-Challenge-App.git
   cd Crowd-sourced-Fitness-Challenge-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run linting to check for issues:
   ```bash
   npm run lint
   ```

4. Auto-fix any linting issues:
   ```bash
   npm run lint:fix
   ```

### Branch Protection and Pull Requests

All changes to the `main` branch must go through a pull request. To push your changes:

1. Create a new branch:
   ```bash
   git checkout -b <branch-name>
   ```

2. Push the branch:
   ```bash
   git push origin <branch-name>
   ```

3. Open a pull request on GitHub. The GitHub Actions workflow will automatically check the code for linting errors before the merge.

---
