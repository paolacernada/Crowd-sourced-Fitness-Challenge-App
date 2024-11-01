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

## Local Backend Server

This TypeScript node.js backend server enables users to make backend function calls locally while developing instead of through Google Cloud Functions, avoiding unecessary usage fees.

### Steps to Set Up Locally:
1. Navigate to the /test_backend folder

2. Initialize the backend with a (separate) package.json
   ```bash
   npm init -y
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. If there isn't a tsconfig.json file, run:
    ```bash
    npx tsc --init
    ```
5. Add script
   "start": "nodemon ts-node src/server.ts",

6. Add .env.server file 
   ```bash
   touch .env.server
   ```
   - Add the following to .env.server:
      SUPABASE_URL = (your SUPABASE_URL here)
      SUPABASE_ANON_KEY = (your SUPABASE_ANON_KEY here)

7. Run
      ```bash
      npm start
      ```

## React Native/Expo Setup
1. Install Expo Go CLI
   ```bash
   npm install -g expo-cli
   ```

2. Install ngrok (For tunneling with Expo)
   ```bash
   npm install --global @expo/ngrok@^4.1.0
   ```

3. Install project dependencies
   ```bash
   npm install
   ```

4. Install react-native-dotenv
   ```bash
   npm install react-native-dotenv --save
   ```

5. Add .env.frontend file 
   ```bash
   touch .env.frontend
   ```
   - Add the following to .env.server:
      SUPABASE_URL = (your SUPABASE_URL here)
      SUPABASE_ANON_KEY = (your SUPABASE_ANON_KEY here)

6. Create an Expo app (if you haven't already)
   ```bash
   create-expo-app@3.0.0
   ```

7. Install Expo Go on your iOS or Android device
   Android: https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US
   iOS: https://apps.apple.com/us/app/expo-go/id982107779

8. Start your development server
   ```bash
   npx expo start
   ```
   *If your device is having network issues, try adding the --tunnel flag

9. Scan QR code with iOS or Android device
   The app should be visible on your phone!


## Notes/References
- Sample code is located in the **app-example** directory
- To learn more about developing your project with Expo, look at the following resources:
- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

---

# Supabase Edge Functions
### Installation
1. Install the supabase CLI (follow the instructions to add to PATH, etc.)
   ```bash
   brew install supabase/tap/supabase
   ```

2. Upgrade supabase CLI
   ```bash
   brew upgrade supabase
   ```

3. Log into Supabase. If you see an error (WSL may cause one) try adding the --no-browser flag
   ```bash
   supabase login
   ```

4. Init supabase project. In the project root folder:
   ```bash
   supabase init
   ```

5. Run
   ```bash
   supabase start
   ```

### Deno installation
1. Install deno
   ```bash
   brew install deno
   ```

2. If using Visual Sudio Code: Install Deno extension 

3. In /supabase/ directory 
   ```bash
   touch deno.json
   ```
   - Add:
      { "compilerOptions": { "lib": ["deno.ns", "deno.unstable"] } }

4. NOTE: Use Deno only in the Supabase directory, to ensure that the Node backend and React Native frontend are unaffected by Deno settings.

5. In /supabase/ directory, run:
   ```bash
   supabase functions build
   ```

6. To deply an edge function myFunction, run:
   ```bash
   supabase functions deploy myFunction
   ```
   - Deployment URL can be found in terminal output after deployment
   - To deploy without JWT, use the  --no-verify-jwt flag

7. To run locally, in the function's directory run:    
   ```bash
   deno run --allow-net --allow-read pathToFunction/index.ts
   OR, while in the folder: 
   deno run --allow-env --watch auth.ts
   ```

- To deploy without needing JWT:
   supabase functions deploy functionName --no-verify-jwt
