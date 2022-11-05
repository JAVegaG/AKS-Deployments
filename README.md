# Micro-project 2

This project consists in deploying containerized machine learning applications using Azure Kubernetes Service and it is divided into 3 main parts:

## Creating an AKS cluster

To achieve this one can follow one of [Azure's tutorials](https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-cli), however assuming you have a fully configured account on Azure, the main steps using [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) are the following:

*  `az group create --name <resourceGroupName> --location <location>`

* ```
    az aks create \
    --resource-group <resourceGroupName> \
    --name <clusterName> \
    --node-count <numberNodes> \
    --vm-set-type <VirtualMachineScaleSets> \
    --enable-managed-identity \
    --enable-addons monitoring \
    --enable-cluster-autoscaler \
    --min-count <minNodes> \
    --max-count <maxNodes> \
    --generate-ssh-keys
    ```

* `az aks install-cli`

* `az aks get-credentials --resource-group <resourceGroupName> --name <clusterName>`

## Creating a Deployment

To do this one needs to create a YAML file specifying all minimum configurations Kubernetes has to apply so that the deployment works appropriately, for instance:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mnist-app
spec:
  selector:
    matchLabels:
      run: mnist-app
  replicas: 1
  template:
    metadata:
      labels:
        run: mnist-app
    spec:
      containers:
      - name: mnist-app
        image: julianvega/mnist-app:latest
        ports:
        - containerPort: 3000
```

## Exposing the app

To expose a deployment on a public IP and make it accessible, a Kubernetes service of type _LoadBalancer_ must be created. Just like the deployments, this can be achieved through commands on the CLI or declarative using a YAML file as shown next:

```
apiVersion: v1
kind: Service
metadata:
  name: mnist-app
  labels:
    run: mnist-app
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    run: mnist-app
```

Next, apply the (configurations)[mnist-app.yml] mentioned before:

`kubectl apply -f <configurations>.yml`

Finally, to check whether the configurations were applied correctly:

```
kubectl get deployments
kubectl get pods
kubectl get services
```