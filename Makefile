# Define project variables
PROJECT_ID := chessgambit
REGION := us-central1
REPOSITORY := chessgambit
FRONTEND_IMAGE := $(REGION)-docker.pkg.dev/$(PROJECT_ID)/$(REPOSITORY)/frontend
BACKEND_IMAGE := $(REGION)-docker.pkg.dev/$(PROJECT_ID)/$(REPOSITORY)/backend
TIMESTAMP := $(shell date +%Y%m%d%H%M%S)
KUBE_NAMESPACE := default  # Update with your namespace if different

# Build and tag frontend image
build-frontend:
	docker build --no-cache --platform linux/amd64 -t $(FRONTEND_IMAGE):prod-$(TIMESTAMP) -f ./frontend/Dockerfile.prod ./frontend

# Build and tag backend image with a timestamp
build-backend:
	docker build --no-cache --platform linux/amd64 -t $(BACKEND_IMAGE):prod-$(TIMESTAMP) -f ./backend/Dockerfile.prod ./backend

# Push frontend image to Artifact Registry
push-frontend:
	docker push $(FRONTEND_IMAGE):prod-$(TIMESTAMP)

# Push backend image with timestamp to Artifact Registry
push-backend:
	docker push $(BACKEND_IMAGE):prod-$(TIMESTAMP)

# Update the Kubernetes deployment with the new backend image tag
update-k8s-backend:
	kubectl set image deployment/backend backend=$(BACKEND_IMAGE):prod-$(TIMESTAMP) --namespace=$(KUBE_NAMESPACE)

update-k8s-frontend:
	kubectl set image deployment/frontend frontend=$(FRONTEND_IMAGE):prod-$(TIMESTAMP) --namespace=$(KUBE_NAMESPACE)

deploy-backend: build-backend push-backend 
deploy-frontend: build-frontend push-frontend 


# Build and push all images (frontend and backend)
deploy: deploy-backend deploy-frontend

# Clean up local images
clean:
	docker rmi $(FRONTEND_IMAGE):prod-$(TIMESTAMP)
	docker rmi $(BACKEND_IMAGE):prod-$(TIMESTAMP)

	
