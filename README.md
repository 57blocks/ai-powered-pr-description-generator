# AI-Powered PR Description Generator

Automatically generates descriptive summaries for pull requests using AI, enhancing clarity and context for reviewers.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [GitHub Workflow](#github-workflow)
- [Building the Project](#building-the-project)
- [Supported AI Models](#supported-ai-models)
- [Contributing](#contributing)
- [License](#license)

## Features

- Automatically generates descriptions for pull requests.
- Supports multiple AI models (e.g., Gemini, OpenAI).
- Integrates seamlessly with GitHub workflows.
- Executes on pull request creation and commit push events.
- Written in TypeScript for type safety and maintainability.

## Getting Started

To get started with the AI-Powered PR Description Generator, follow the instructions below to set up your environment and configure the project.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or above)
- [npm](https://www.npmjs.com/) (Node package manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ai-powered-pr-description-generator.git
   cd ai-powered-pr-description-generator

2. Install the dependencies:

   ```bash
   
## Configuration
Before using the generator, you need to configure the following secrets in your GitHub repository settings:

GEMINI_API_KEY: Your API key for the Gemini model.
OPENAI_API_KEY: Your API key for the OpenAI model (if applicable).

GITHUB_TOKEN should be required (https://github.com/settings/tokens), it needs permission to modify the pull request.


## Usage
Once configured, the action will automatically execute whenever a pull request is created or a commit is pushed to the repository.

## GitHub Workflow
Here's an example of how to set up your GitHub Actions workflow file (.github/workflows/description-generator.yml):

## Supported AI Models
The project currently supports the following AI models for generating descriptions:

- Gemini: An AI model that provides concise and relevant descriptions for pull requests.
- OpenAI: A more advanced AI model that can generate detailed and nuanced descriptions.
You can configure which AI model to use in your workflow settings.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

Fork the repository.
Create your feature branch: git checkout -b feature/new-feature.
Commit your changes: git commit -m 'Add some feature'.
Push to the branch: git push origin feature/new-feature.
Open a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

### Summary of Additions and Improvements:
- **Configuration**: Added details about environment variables needed for setup.
- **Usage**: Included a command for local execution.
- **GitHub Workflow**: Provided a full example of a GitHub Actions workflow.
- **Building the Project**: Clarified the build process.
- **Contributing**: Maintained clear instructions for contributing to the project.

Feel free to modify any sections further to better fit your project's specifics!
