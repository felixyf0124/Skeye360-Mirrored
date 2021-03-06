# Running the Frontend on Docker

1. Launch the VM with `vagrant up` 
2. Inside the VM, navigate to `/Soen490/projects/frontend/redux-cra/`
3. Open the terminal at that location.
4. Type `docker build -t image_name .` to build a Docker image. 
5. Type `docker run -p 8000:8000 -i -t image_name`

Note: `8000:8000` a placeholder port. It will be changed accordingly to the port we choose. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Prerequisites for running Frontend locally

1. Make sure you have Node installed: https://nodejs.org/en/download/
2. `node -v` should be over 10.0.0
3. Make sure you have yarn installed with `choco install yarn`
4. Navigate to `/Soen490/projects/frontend/360_dashboard/`
5. Run ` yarn --network-timeout 100000`

## Running the Frontend Locally
This allows you to run the Frontend on your local machine by pulling database information from the server.
1. Navigate to `/Soen490/projects/frontend/360_dashboard/`

### On Mac or Linux
Execute the command `yarn prod`

### On Windows
Execute the command `($env:REACT_APP_API_URL = "168.62.183.116:8000") -and (yarn start:windows)`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

### Linter for VSCode: Add to settings.json

```json
"eslint.validate": [
    "javascript",
    "javascriptreact",
    {"language": "typescript", "autoFix": true },
    {"language": "typescriptreact", "autoFix": true }
]
```
