# Stack Overflow Clone

A modern Stack Overflow clone built with React, featuring question browsing, search functionality, user authentication, and a responsive design.

## Project Description

This is a full-featured Stack Overflow clone that provides a platform for developers to ask questions, search for answers, and browse programming-related content. The application replicates core Stack Overflow functionality with a clean, modern interface.

### Features

- **User Authentication**: Complete login and signup system with form validation
- **Question Browsing**: View questions with voting, answer counts, and metadata
- **Search Functionality**: Advanced search with relevance and accuracy filters
- **Question Details**: Full question pages with answers, code snippets, and user information
- **Recent Searches**: Personalized recent search history for authenticated users
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean interface inspired by Stack Overflow's design system

### Technology Stack

- **Frontend**: React 19.1.0 with React Router for navigation
- **Styling**: CSS3 with modern flexbox and grid layouts
- **Date Handling**: date-fns for relative time formatting
- **HTML Processing**: node-html-parser for Stack Overflow content processing
- **Build Tool**: Create React App with modern JavaScript features
- **Containerization**: Docker with multi-stage builds and nginx serving

### Project Structure

```
src/
├── components/
│   ├── Auth/           # Login and signup components
│   ├── Header/         # Navigation header with auth controls
│   ├── QuestionCard/   # Question preview cards
│   ├── SearchBar/      # Search input component
│   └── SearchResults/  # Search results display
├── pages/
│   ├── HomePage/       # Landing page with recent searches
│   ├── QuestionPage/   # Individual question details
│   └── SearchPage/     # Search results page
├── services/
│   └── api.js          # API integration layer
└── utils/
    └── helpers.js      # Utility functions for formatting
```

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Docker Setup

This application has been dockerized for easy deployment and development. You can run the app using Docker in both production and development modes.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Production Build

To build and run the production version of the app:

```bash
# Build and run with docker-compose
docker-compose up --build

# Or build and run manually
docker build -t overflow-app .
docker run -p 3000:80 overflow-app
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Development Mode

For development with hot reloading:

```bash
# Run development mode
docker-compose --profile dev up --build overflow-dev
```

The development server will be available at [http://localhost:3001](http://localhost:3001).

### Docker Commands

```bash
# Build production image
docker build -t overflow-app .

# Build development image
docker build -f Dockerfile.dev -t overflow-app-dev .

# Run production container
docker run -p 3000:80 overflow-app

# Run development container with volume mounting
docker run -p 3001:3000 -v $(pwd):/app -v /app/node_modules overflow-app-dev

# Stop all containers
docker-compose down

# View logs
docker-compose logs overflow-app
```

### Docker Files

- `Dockerfile` - Multi-stage production build with nginx
- `Dockerfile.dev` - Development build with hot reloading
- `docker-compose.yml` - Orchestration for both production and development
- `.dockerignore` - Files to exclude from Docker build context
- `nginx.conf` - Custom nginx configuration for serving the React app

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
