# Phase V Spec — Kafka + Dapr + Oracle Cloud
Final evolution of the TODO app into a distributed, event-driven system deployed on Oracle Cloud OKE.

## Event-Driven Architecture (Dapr + Kafka)

### Pub/Sub Strategy
- **Broker**: Apache Kafka (abstracted via Dapr).
- **Topic**: `task-events`.
- **Publisher**: Backend FastAPI service.
- **Subscriber**: Worker service (Python).

### Dapr Sidecar Integration
- All services (Backend, Frontend, Worker) will have Dapr sidecar containers.
- Communication with Kafka and state management will happen via Dapr components.

## New Components

### Worker Service (`worker/`)
- Listens for `task-created` events via Dapr subscription.
- Uses Groq AI to generate a sub-task list for every new task created.
- Updates the task in Supabase with these AI suggestions.

### Dapr Components (`k8s/dapr/`)
- `pubsub.yaml`: Configured for Kafka.
- `statestore.yaml`: Configured for state management.

## Oracle Cloud (OKE) Deployment
- Use Oracle Cloud Infrastructure (OCI) Container Engine for Kubernetes.
- Use `oci-load-balancer` to expose the frontend.
- Database: Remain on external Supabase for Phase V.

## Data Flow
1. User creates a task in the UI.
2. Backend saves task to Supabase and publishes event to Dapr topic `task-events`.
3. Dapr forwards event to Kafka.
4. Worker service (via Dapr) receives the event.
5. Worker calls Groq AI to generate suggestions.
6. Worker saves suggestions back to the database.
