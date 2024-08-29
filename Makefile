# Variables
PNPM = pnpm
NODE = node
TSC = npx tsc

# Initialization
init:
	$(PNPM) run preinstall
	$(PNPM) run init-project

# Build project
build:
	$(PNPM) run preinstall
	$(PNPM) run build

# Run project in development mode
dev:
	$(PNPM) run preinstall
	$(PNPM) run dev

# Run production build
start:
	$(PNPM) run preinstall
	$(PNPM) run start

# Install dependencies
install:
	$(PNPM) run preinstall
	$(PNPM) install

# Clean project
clean:
	rm -rf node_modules
	rm -rf dist

# Rebuild project
rebuild: clean install build

# Display help
help:
	@echo "Makefile commands:"
	@echo "  init       - Initialize project (install dependencies and build)"
	@echo "  build      - Build project"
	@echo "  dev        - Run project in development mode"
	@echo "  start      - Run project in production mode"
	@echo "  install    - Install dependencies"
	@echo "  clean      - Clean project"
	@echo "  rebuild    - Clean, install dependencies, and build"
	@echo "  help       - Display this help"
