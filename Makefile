# Define project variables
PROJECT_ID := chessgambit
REGION := us-central1
REPOSITORY := chessgambit
FRONTEND_IMAGE := $(REGION)-docker.pkg.dev/$(PROJECT_ID)/$(REPOSITORY)/frontend
BACKEND_IMAGE := $(REGION)-docker.pkg.dev/$(PROJECT_ID)/$(REPOSITORY)/backend

# Build and tag frontend image
build-frontend:
	docker build --platform linux/amd64 -t $(FRONTEND_IMAGE):prod -f ./frontend/Dockerfile.prod ./frontend

# Build and tag backend image
build-backend:
	docker build --platform linux/amd64 -t $(BACKEND_IMAGE):prod -f ./backend/Dockerfile.prod ./backend

# Push frontend image to Artifact Registry
push-frontend:
	docker push $(FRONTEND_IMAGE):prod

# Push backend image to Artifact Registry
push-backend:
	docker push $(BACKEND_IMAGE):prod

# Build and push all images (frontend and backend)
deploy: build-frontend build-backend push-frontend push-backend

# Clean up local images
clean:
	docker rmi $(FRONTEND_IMAGE):prod
	docker rmi $(BACKEND_IMAGE):prod
