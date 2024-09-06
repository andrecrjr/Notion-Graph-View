# Notion Graph Viewer

This project provides a Next.js-based front-end that displays Notion pages in a graphical view. The application requires setting up a backend server alongside the front-end for full functionality.

## Technologies

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Next.js**: A React framework for building server-side rendering and static web applications.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.

## Prerequisites

Before you begin, ensure you have Node.js(NVM) and Make installed on your system. This project uses make and pnpm for managing dependencies and scripts, so make sure these tools are also installed.

### Install Make and PNPM
You can install make and pnpm using the following commands:

```bash
    sudo apt-get install make
    npm install -g pnpm
```

## Getting Started

First, run the development server:

```bash
    # Download all pnpm packages and up all containers
    make run-all

    # Run only the containers
    make run-dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the front-end.